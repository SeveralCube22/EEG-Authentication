package com.vmanam.eeg_backend.Configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.sagemakerruntime.SageMakerRuntimeClient;

@Configuration
public class AWSModelRuntime {
    @Bean
    @Primary
    public SageMakerRuntimeClient sagemakerRuntime() {
        return SageMakerRuntimeClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.US_WEST_1)
                .build();
    }

    @Bean
    @Primary
    public LambdaClient lambdaClient() {
        return LambdaClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.US_WEST_1)
                .build();
    }
}
