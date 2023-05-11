package com.vmanam.eeg_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModelReturnDTO {
    public String user;
    public float confidence;
}
