package com.vmanam.eeg_backend.Controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.sagemaker.SageMakerClient;
import software.amazon.awssdk.services.sagemakerruntime.SageMakerRuntimeClient;
import software.amazon.awssdk.services.sagemakerruntime.model.InvokeEndpointRequest;

import java.nio.charset.Charset;

@RestController
@RequestMapping("/api/model")
public class ModelController {

    @Value("${preprocessing.function.name}")
    private String preprocessingFunctionName;

    @Value("${sagemaker.endpoint.name}")
    private String sagemakerEndpointName;

    @PostMapping("/data")
    public String classifyEEGData(@RequestBody String reqData) {
        InvokeRequest preprocessReq = InvokeRequest.builder()
                .functionName(preprocessingFunctionName)
                .payload(SdkBytes.fromUtf8String(reqData))
                .build();

        LambdaClient lambdaClient = LambdaClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.US_WEST_1)
                .build();

        String preprocessedRes = lambdaClient.invoke(preprocessReq).payload().asUtf8String() ;
        String modelReqBody = "{\"Input\":" + preprocessedRes + "}";
        System.out.println(modelReqBody);
        SageMakerRuntimeClient sagemakerClient = SageMakerRuntimeClient.builder()
                .credentialsProvider(DefaultCredentialsProvider.create())
                .region(Region.US_WEST_1)
                .build();

        InvokeEndpointRequest modelReq = InvokeEndpointRequest.builder()
                .endpointName(sagemakerEndpointName)
                .contentType("application/json")
                .body(SdkBytes.fromString(modelReqBody, Charset.defaultCharset()))
                .build();

        return sagemakerClient.invokeEndpoint(modelReq).body().asString(Charset.defaultCharset());
    }
}
