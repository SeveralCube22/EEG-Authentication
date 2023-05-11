package com.vmanam.eeg_backend.Controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vmanam.eeg_backend.Configurations.JwtTokenUtil;
import com.vmanam.eeg_backend.DTOs.JwtResponseDTO;
import com.vmanam.eeg_backend.DTOs.ModelDataDTO;
import com.vmanam.eeg_backend.Entities.User;
import com.vmanam.eeg_backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.sagemakerruntime.SageMakerRuntimeClient;
import software.amazon.awssdk.services.sagemakerruntime.model.InvokeEndpointRequest;

import java.util.Map;
import java.util.Optional;
import java.nio.charset.Charset;

@RestController
@RequestMapping("/api/model")
public class ModelController {

    @Value("${preprocessing.function.name}")
    private String preprocessingFunctionName;

    @Value("${sagemaker.endpoint.name}")
    private String sagemakerEndpointName;

    @Autowired
    SageMakerRuntimeClient sagemakerClient;

    @Autowired
    LambdaClient lambdaClient;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @PostMapping("/data")
    public ResponseEntity<?> classifyEEGData(@RequestBody ModelDataDTO modelDTO) throws JsonProcessingException {
        InvokeRequest preprocessReq = InvokeRequest.builder()
                .functionName(preprocessingFunctionName)
                .payload(SdkBytes.fromUtf8String(modelDTO.getReqData()))
                .build();

        String preprocessedRes = lambdaClient.invoke(preprocessReq).payload().asUtf8String() ;
        String modelReqBody = "{\"Input\":" + preprocessedRes + "}";

        InvokeEndpointRequest modelReq = InvokeEndpointRequest.builder()
                .endpointName(sagemakerEndpointName)
                .contentType("application/json")
                .body(SdkBytes.fromString(modelReqBody, Charset.defaultCharset()))
                .build();

        String result = sagemakerClient.invokeEndpoint(modelReq).body().asString(Charset.defaultCharset());
        Map<String, Integer> map = mapper.readValue(result, Map.class);
        int userId = map.get("Output");
        Optional<User> potUser = userRepository.findByUserId(userId);
        if(potUser.isPresent()) {
            User user = potUser.get();
            if(user.getEmail().equals(modelDTO.getEmail())) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                final String token = jwtTokenUtil.generateToken(authentication);
                return ResponseEntity.ok(new JwtResponseDTO(token));
            }
            else
                return ResponseEntity.status(HttpStatus.CONFLICT).build(); // EEG Data is saying that it is another user or actual user gave wrong email leading to the email's being different
        }
        else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admindata")
    public String classifyEEGData(@RequestBody String data) throws JsonProcessingException {
        InvokeRequest preprocessReq = InvokeRequest.builder()
                .functionName(preprocessingFunctionName)
                .payload(SdkBytes.fromUtf8String(data))
                .build();

        String preprocessedRes = lambdaClient.invoke(preprocessReq).payload().asUtf8String() ;
        String modelReqBody = "{\"Input\":" + preprocessedRes + "}";

        InvokeEndpointRequest modelReq = InvokeEndpointRequest.builder()
                .endpointName(sagemakerEndpointName)
                .contentType("application/json")
                .body(SdkBytes.fromString(modelReqBody, Charset.defaultCharset()))
                .build();

        String result = sagemakerClient.invokeEndpoint(modelReq).body().asString(Charset.defaultCharset());
        Map<String, Integer> map = mapper.readValue(result, Map.class);
        int userId = map.get("Output");
        Optional<User> potUser = userRepository.findByUserId(userId);
        if(!potUser.isPresent()) return "User not found!";
        else return potUser.get().getName();
    }
}
