package com.sweettreats.SweetTreats.service;

import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
    String uploadFile(MultipartFile file);
}
