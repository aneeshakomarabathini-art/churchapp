package com.divinelight.bibleapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public String store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) return "";
        try {
            String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
            String safeName = original.replaceAll("[^a-zA-Z0-9._-]", "_");
            String name = UUID.randomUUID() + "_" + safeName;
            Path dir = Paths.get(uploadDir, folder).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(name);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + folder + "/" + name;
        } catch (IOException ex) {
            throw new RuntimeException("File upload failed: " + ex.getMessage());
        }
    }
}
