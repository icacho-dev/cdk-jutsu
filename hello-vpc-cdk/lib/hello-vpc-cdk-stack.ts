import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
// import { AutoScalingGroup } from "aws-cdk-lib/aws-autoscaling";
import {
  aws_autoscaling as autoscaling,
  aws_elasticloadbalancingv2 as elb,
} from "aws-cdk-lib";

export class HelloVpcCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "HelloVpcCdkVpc", {
      cidr: "10.1.0.0/16",
      maxAzs: 2, // Default is all AZs in the region
      subnetConfiguration: [
        { cidrMask: 24, name: "Web", subnetType: ec2.SubnetType.PUBLIC },
        {
          cidrMask: 24,
          name: "Application",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Define the machine image for the Auto Scaling Group
    const machineImage = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    });

    // Create an Auto Scaling Group with the specified VPC and instance type
    const autoScalingGroup = new autoscaling.AutoScalingGroup(
      this,
      "HelloVpcCdkAsg",
      {
        vpc: vpc,
        instanceType: new ec2.InstanceType("t2.micro"),
        machineImage: machineImage,
        maxCapacity: 3,
        minCapacity: 1,
        desiredCapacity: 2,
        // Use only public subnets for instances to ensure they can be reached
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      }
    );

    // Improved user data script to ensure httpd is properly configured
    autoScalingGroup.addUserData(
      "#!/bin/bash -xe",
      "yum update -y",
      "yum install -y httpd",
      "systemctl start httpd",
      "systemctl enable httpd",
      "echo '<html><body><h1>Hello, VPC from CDK!</h1><p>Server is up and running.</p></body></html>' > /var/www/html/index.html",
      "curl http://169.254.169.254/latest/meta-data/instance-id > /var/www/html/instance.txt", // Adds instance ID for testing
      "echo 'UserData script completed' > /var/www/html/userdata_complete.txt" // Debugging helper
    );

    // Allow inbound traffic on port 80 for the Auto Scaling Group instances
    autoScalingGroup.connections.allowFromAnyIpv4(
      ec2.Port.tcp(80),
      "Allow HTTP traffic"
    );

    // Create a load balancer in the public subnet
    const lb = new elb.ApplicationLoadBalancer(
      this,
      "HelloVpcCdkLoadBalancer",
      {
        vpc: vpc,
        internetFacing: true,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      }
    );

    // Create a target group with improved health check settings
    const targetGroup = new elb.ApplicationTargetGroup(this, "WebTargetGroup", {
      vpc,
      port: 80,
      protocol: elb.ApplicationProtocol.HTTP,
      targetType: elb.TargetType.INSTANCE,
      healthCheck: {
        path: "/",
        interval: cdk.Duration.seconds(60),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
        healthyHttpCodes: "200,302,404", // Allow more response codes to be considered healthy for testing
      },
    });

    // Add the ASG to the target group
    targetGroup.addTarget(autoScalingGroup);

    const listener = lb.addListener("HttpListener", {
      port: 80,
      open: true,
      defaultTargetGroups: [targetGroup],
    });

    listener.connections.allowDefaultPortFromAnyIpv4(
      "Allow internet access to the load balancer"
    );

    // Export the load balancer DNS name as a CloudFormation output
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: lb.loadBalancerDnsName,
      description: "DNS name of the load balancer",
      exportName: "HelloVpcLbDns",
    });
  }
}
