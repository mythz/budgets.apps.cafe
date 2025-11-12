import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import { env } from 'process'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg!.groups!.value : "myapp.client";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Only generate certificates for dev server, not for build
const isDevServer = !process.argv.includes('build');

if (isDevServer) {
    console.log(`Certificate path: ${certFilePath}`);

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {

        // mkdir to fix dotnet dev-certs error 3 https://github.com/dotnet/aspnetcore/issues/58330
        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true });
        }
        if (
            0 !==
            child_process.spawnSync(
                "dotnet",
                [
                    "dev-certs",
                    "https",
                    "--export-path",
                    certFilePath,
                    "--format",
                    "Pem",
                    "--no-password",
                ],
                { stdio: "inherit" }
            ).status
        ) {
            throw new Error("Could not create certificate.");
        }
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001';
const apiUrl = process.env.NODE_ENV === 'development' ? target : ''

// https://vitejs.dev/config/
export default defineConfig(async () => {
    return {
        define: { API_URL: `"${apiUrl}"` },
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            }
        },
        build: {
            target: 'baseline-widely-available',
        },
        server: {
            proxy: {
                '^/api': {
                    target,
                    secure: false
                }
            },
            port: 5173,
            ...(fs.existsSync(keyFilePath) && fs.existsSync(certFilePath) ? {
                https: {
                    key: fs.readFileSync(keyFilePath),
                    cert: fs.readFileSync(certFilePath),
                }
            } : {})
        }
    }
})
