package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.ChurchRequestResponse;
import com.divinelight.bibleapp.dto.ChurchResponse;
import com.divinelight.bibleapp.dto.UserResponse;
import com.divinelight.bibleapp.entity.*;
import com.divinelight.bibleapp.repository.*;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ChurchRepository churchRepository;
    private final ChurchContentRepository contentRepository;
    private final MatrimonyProfileRepository matrimonyProfileRepository;
    private final ResponseUrlService urlService;

    public AdminService(UserRepository userRepository, ChurchRepository churchRepository, ChurchContentRepository contentRepository, MatrimonyProfileRepository matrimonyProfileRepository, ResponseUrlService urlService) {
        this.userRepository = userRepository;
        this.churchRepository = churchRepository;
        this.contentRepository = contentRepository;
        this.matrimonyProfileRepository = matrimonyProfileRepository;
        this.urlService = urlService;
    }

    public Map<String, Object> dashboard() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("approvedChurches", churchRepository.findByStatus(ChurchStatus.APPROVED).size());
        data.put("pendingRequests", churchRepository.findByStatus(ChurchStatus.PENDING).size());
        data.put("matrimonyProfiles", matrimonyProfileRepository.count());
        data.put("churchPosts", contentRepository.count());
        return data;
    }

    public List<ChurchRequestResponse> churchRequests() {
        return churchRepository.findByStatusOrderByCreatedAtDesc(ChurchStatus.PENDING).stream().map(ChurchRequestResponse::new).toList();
    }

    public List<UserResponse> allUsers() {
        return userRepository.findAll().stream().map(u -> new UserResponse(u, churchRepository.findByAdminUser(u).orElse(null))).toList();
    }

    public List<ChurchResponse> allChurches() {
        String base = urlService.baseUrl();
        return churchRepository.findAll().stream().map(c -> new ChurchResponse(c, base)).toList();
    }

    public ChurchResponse approveChurch(Long churchId) {
        Church church = churchRepository.findById(churchId).orElseThrow(() -> new RuntimeException("Church request not found"));
        church.setStatus(ChurchStatus.APPROVED);
        if (church.getAdminUser() != null) {
            church.getAdminUser().setStatus(AccountStatus.ACTIVE);
            userRepository.save(church.getAdminUser());
        }
        return new ChurchResponse(churchRepository.save(church), urlService.baseUrl());
    }

    public ChurchResponse rejectChurch(Long churchId) {
        Church church = churchRepository.findById(churchId).orElseThrow(() -> new RuntimeException("Church request not found"));
        church.setStatus(ChurchStatus.REJECTED);
        if (church.getAdminUser() != null) {
            church.getAdminUser().setStatus(AccountStatus.REJECTED);
            userRepository.save(church.getAdminUser());
        }
        return new ChurchResponse(churchRepository.save(church), urlService.baseUrl());
    }
}
