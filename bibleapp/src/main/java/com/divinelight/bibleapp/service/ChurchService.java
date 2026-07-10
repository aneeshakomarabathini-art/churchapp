package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.ChurchContentResponse;
import com.divinelight.bibleapp.dto.ChurchResponse;
import com.divinelight.bibleapp.entity.*;
import com.divinelight.bibleapp.repository.ChurchContentRepository;
import com.divinelight.bibleapp.repository.ChurchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ChurchService {
    private final ChurchRepository churchRepository;
    private final ChurchContentRepository contentRepository;
    private final ResponseUrlService urlService;
    private final FileStorageService fileStorageService;

    public ChurchService(
            ChurchRepository churchRepository,
            ChurchContentRepository contentRepository,
            ResponseUrlService urlService,
            FileStorageService fileStorageService
    ) {
        this.churchRepository = churchRepository;
        this.contentRepository = contentRepository;
        this.urlService = urlService;
        this.fileStorageService = fileStorageService;
    }

    public List<ChurchResponse> approvedChurches() {
        String base = urlService.baseUrl();
        return churchRepository.findByStatusOrderByCreatedAtDesc(ChurchStatus.APPROVED).stream().map(c -> new ChurchResponse(c, base)).toList();
    }

    public ChurchResponse church(Long id) {
        Church church = churchRepository.findById(id).orElseThrow(() -> new RuntimeException("Church not found"));
        if (church.getStatus() != ChurchStatus.APPROVED) throw new RuntimeException("Church not approved");
        return new ChurchResponse(church, urlService.baseUrl());
    }

    public ChurchResponse myChurch(User user) {
        Church church = churchRepository.findByAdminUser(user).orElseThrow(() -> new RuntimeException("Church not found for this admin"));
        return new ChurchResponse(church, urlService.baseUrl());
    }

    @Transactional
    public ChurchResponse updateMyChurch(
            User user,
            String churchName,
            String churchLocation,
            String churchAddress,
            String churchPhone,
            String churchEmail,
            String churchTiming,
            String churchAbout,
            MultipartFile churchPhoto
    ) {
        Church church = churchRepository.findByAdminUser(user).orElseThrow(() -> new RuntimeException("Church not found for this admin"));

        if (!blank(churchName)) church.setChurchName(churchName.trim());
        if (!blank(churchLocation)) church.setChurchLocation(churchLocation.trim());
        if (!blank(churchAddress)) church.setChurchAddress(churchAddress.trim());
        if (!blank(churchPhone)) church.setChurchPhone(churchPhone.trim());
        if (!blank(churchEmail)) church.setChurchEmail(churchEmail.trim().toLowerCase());
        if (!blank(churchTiming)) church.setChurchTiming(churchTiming.trim());
        if (churchAbout != null) church.setChurchAbout(churchAbout.trim());

        if (churchPhoto != null && !churchPhoto.isEmpty()) {
            church.setChurchPosterPath(fileStorageService.store(churchPhoto, "churches"));
        }

        Church saved = churchRepository.save(church);
        return new ChurchResponse(saved, urlService.baseUrl());
    }

    public List<ChurchContentResponse> content(Long churchId, String type) {
        Church church = churchRepository.findById(churchId).orElseThrow(() -> new RuntimeException("Church not found"));
        if (church.getStatus() != ChurchStatus.APPROVED) throw new RuntimeException("Church not approved");
        String base = urlService.baseUrl();
        List<ChurchContent> list;
        if (type == null || type.isBlank()) {
            list = contentRepository.findByChurchOrderByCreatedAtDesc(church);
        } else {
            list = contentRepository.findByChurchAndTypeOrderByCreatedAtDesc(church, ContentType.valueOf(type.trim().toUpperCase()));
        }
        return list.stream().map(c -> new ChurchContentResponse(c, base)).toList();
    }

    public List<ChurchContentResponse> latestContent() {
        String base = urlService.baseUrl();
        return contentRepository.findTop20ByOrderByCreatedAtDesc().stream().map(c -> new ChurchContentResponse(c, base)).toList();
    }

    private boolean blank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
