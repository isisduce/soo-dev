# soo-dev
soo-dev

# Run BE and FE using F5 in vscode
add launch.json into .vscode
example:
{
    // IntelliSense를 사용하여 가능한 특성에 대해 알아보세요.
    // 기존 특성에 대한 설명을 보려면 가리킵니다.
    // 자세한 내용을 보려면 https://go.microsoft.com/fwlink/?linkid=830387을(를) 방문하세요.
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Current File",
            "request": "launch",
            "mainClass": "com.soo.appmain.ApplicationMain",
            "preLaunchTask": "Run BE and FE together"
        },
        {
            "type": "java",
            "name": "ApplicationMain",
            "request": "launch",
            "mainClass": "com.soo.appmain.ApplicationMain",
            "projectName": "be-java-maven",
            "preLaunchTask": "Run BE and FE together"
        }
    ]
}

add tasks.json into .vscode
example:
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Run BE (Java)",
            "type": "shell",
            "command": "./mvnw spring-boot:run",
            "options": {
                "cwd": "${workspaceFolder}/apps/be-java-maven"
            },
            "group": "build",
            "isBackground": true
        },
        {
            "label": "Run BE (NestJs)",
            "type": "shell",
            "command": "pnpm install; pnpm start:dev",
            "options": {
                "cwd": "${workspaceFolder}/apps/be-nestjs-ts"
            },
            "group": "build",
            "isBackground": true
        },
        {
            "label": "Run FE (React)",
            "type": "shell",
            "command": "pnpm install; pnpm dev",
            "options": {
                "cwd": "${workspaceFolder}/apps/fe-vite-react-ts"
            },
            "group": "build",
            "isBackground": true
        },
        {
            "label": "Run BE and FE together",
            "dependsOn": [
                "Run BE (Java)",
                "Run BE (NestJs)",
                "Run FE (React)"
            ],
            "group": "build",
            "problemMatcher": []
        }
    ]
}