# Better Lambda - Production-Ready CDK Project

This project demonstrates a production-ready AWS CDK setup using the **pre-built deployment package approach** for Lambda functions.

## Project Structure

```
better-lambda/
├── bin/                           # CDK app entry point
├── lib/                           # CDK stack definitions
├── test/                          # CDK tests
├── lambda-functions/              # Lambda function source code
│   ├── user-service/
│   │   ├── src/
│   │   │   ├── index.ts          # Lambda handler
│   │   │   └── handlers/         # Business logic
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── order-service/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── shared/                        # Shared utilities and types
│   ├── types/
│   └── utils/
├── deployments/                   # Build artifacts and scripts
│   ├── artifacts/                # Built Lambda .zip files
│   └── build-scripts/            # Build automation
├── .github/workflows/            # CI/CD pipelines
└── package.json                  # Root workspace configuration
```

## Getting Started

### 1. Bootstrap the Project

```bash
npm run bootstrap
```

### 2. Build Lambda Functions

```bash
npm run build-lambdas
```

### 3. Deploy Infrastructure

```bash
npm run deploy
```

## Local Development

For local development and testing, see [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md).

## Development Workflow

### Building Individual Lambda Functions

```bash
# User service
cd lambda-functions/user-service
npm run build
npm run package

# Order service
cd lambda-functions/order-service
npm run build
npm run package
```

### CDK Commands

```bash
# Synthesize CloudFormation template
npm run cdk synth

# Deploy stack
npm run cdk deploy

# Destroy stack
npm run cdk destroy
```

## CI/CD Pipeline

The project includes GitHub Actions workflows that:

1. **Build Phase**: Compiles and packages all Lambda functions
2. **Deploy Phase**: Deploys infrastructure using CDK (main branch only)

### Required Secrets

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Architecture

Diagram (static)

![Sandbox - Architecture v2 _ Mermaid Chart-2025-07-09-173535](https://github.com/user-attachments/assets/1184f53f-92ce-4e54-8b62-066014f68adc)

Diagram (mermaid)

```mermaid
graph TD
    subgraph internet[Internet]
        A[<img src='https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Resource-Icons_02072025/Res_General-Icons/Res_48_Light/Res_Users_48_Light.svg' width='40px'><br>Users]
    end

    subgraph awsCloud["AWS Cloud"]
        subgraph apiGateway["API Gateway"]
            AGW[<img src='https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg' width='40px'><br>API Gateway<br>REST API]

            subgraph apiResources["API Resources"]
                USERS[users resource<br>POST, GET with userId]
                ORDERS[orders resource<br>POST, GET with orderId]
            end
        end

        subgraph lambdaFuncs["AWS Lambda Functions"]
            USF[<img src='https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-Lambda_48.svg' width='40px'><br>User Service<br>Function<br>Node.js 20.x]
            OSF[<img src='https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-Lambda_48.svg' width='40px'><br>Order Service<br>Function<br>Node.js 20.x]
        end

        subgraph securityMon["Security & Monitoring"]
            IAM[<img src='https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Identity-and-Access-Management_48.svg' width='40px'><br>IAM<br>Execution Roles]
            CW[<img src='https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main/Architecture-Service-Icons_02072025/Arch_Management-Governance/48/Arch_Amazon-CloudWatch_48.svg' width='40px'><br>CloudWatch<br>Logs & Metrics]
        end
    end

    %% User interactions
    A -->|HTTPS Requests| AGW
    
    %% API Gateway to API Resources
    AGW --> USERS
    AGW --> ORDERS

    %% API Resources to Lambda Functions
    USERS -->|POST users<br>GET users with userId| USF
    ORDERS -->|POST orders<br>GET orders with orderId| OSF

    %% Security and Monitoring connections
    IAM -.->|Execution Role| USF
    IAM -.->|Execution Role| OSF
    USF -.->|Logs & Metrics| CW
    OSF -.->|Logs & Metrics| CW

    %% AWS Color Palette Styling (classes)
    classDef lambdaStyle stroke:#FF9900,stroke-width:3px,color:#232F3E
    classDef apiStyle stroke:#FF4B4B,stroke-width:3px,color:#232F3E
    classDef securityStyle stroke:#7AA116,stroke-width:3px,color:#232F3E
    classDef resourceStyle stroke:#3498DB,stroke-width:3px,color:#232F3E
    classDef userStyle stroke:#E74C3C,stroke-width:3px,color:#232F3E

    class USF,OSF lambdaStyle
    class AGW apiStyle
    class IAM,CW securityStyle
    class USERS,ORDERS resourceStyle
    class A userStyle

    %% Subgraph Styling (Transparent Backgrounds)
    style internet fill:none,stroke:#E74C3C,stroke-width:2px
    style awsCloud fill:none,stroke:#3498DB,stroke-width:2px
    style apiGateway fill:none,stroke:#FF9900,stroke-width:2px
    style apiResources fill:none,stroke:#3498DB,stroke-width:1px
    style lambdaFuncs fill:none,stroke:#FF9900,stroke-width:2px
    style securityMon fill:none,stroke:#7AA116,stroke-width:2px
```

## Architecture Benefits

- ✅ **Separation of Concerns**: Infrastructure and application code are clearly separated
- ✅ **Consistent Deployments**: Same artifacts deployed across environments
- ✅ **Fast Deployments**: No build time during CDK deployment
- ✅ **Version Control**: Artifacts can be versioned and rolled back
- ✅ **Team Scalability**: Infrastructure and application teams can work independently

## Lambda Functions

### User Service

- **POST** `/users` - Create a new user
- **GET** `/users/{userId}` - Get user by ID

### Order Service

- **POST** `/orders` - Create a new order
- **GET** `/orders/{orderId}` - Get order by ID

Both services return JSON responses and include proper error handling.
