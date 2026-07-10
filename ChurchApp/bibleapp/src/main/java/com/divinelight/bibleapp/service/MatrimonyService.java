package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.MatrimonyInterestResponse;
import com.divinelight.bibleapp.dto.MatrimonyProfileResponse;
import com.divinelight.bibleapp.entity.*;
import com.divinelight.bibleapp.repository.MatrimonyInterestRepository;
import com.divinelight.bibleapp.repository.MatrimonyProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MatrimonyService {
    private final MatrimonyProfileRepository profileRepository;
    private final MatrimonyInterestRepository interestRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final ResponseUrlService urlService;

    public MatrimonyService(MatrimonyProfileRepository profileRepository, MatrimonyInterestRepository interestRepository, FileStorageService fileStorageService, NotificationService notificationService, ResponseUrlService urlService) {
        this.profileRepository = profileRepository;
        this.interestRepository = interestRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
        this.urlService = urlService;
    }

    public MatrimonyProfileResponse createOrUpdate(User user, String name, String age, String gender, String location, String denomination, String occupation, String education, String familyDetails, String phone, String email, MultipartFile photo) {
        if (blank(name) || blank(age) || blank(gender) || blank(location) || blank(denomination) || blank(occupation) || blank(education) || blank(phone) || blank(email) || blank(familyDetails)) {
            throw new RuntimeException("Please fill all the details before saving your matrimony profile");
        }
        MatrimonyProfile profile = profileRepository.findByUser(user).orElseGet(MatrimonyProfile::new);
        profile.setUser(user);
        profile.setName(name.trim());
        profile.setAge(age.trim());
        profile.setGender(gender.trim());
        profile.setLocation(location.trim());
        profile.setDenomination(denomination.trim());
        profile.setOccupation(occupation.trim());
        profile.setEducation(education.trim());
        profile.setBio(familyDetails.trim());
        profile.setPhone(phone.trim());
        profile.setEmail(email.trim());
        String photoPath = fileStorageService.store(photo, "matrimony");
        if (!photoPath.isBlank()) {
            profile.setPhotoPath(photoPath);
        }

        if (blank(profile.getPhotoPath())) {
            throw new RuntimeException("Please upload profile photo before saving your matrimony profile");
        }
        MatrimonyProfile saved = profileRepository.save(profile);
        return buildResponse(saved, user);
    }

    public MatrimonyProfileResponse myProfile(User user) {
        MatrimonyProfile profile = profileRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Profile not created yet"));
        return buildResponse(profile, user);
    }

    public List<MatrimonyProfileResponse> profiles(User user) {
        return profileRepository.findAllByOrderByCreatedAtDesc().stream().map(p -> buildResponse(p, user)).toList();
    }

    @Transactional
    public MatrimonyInterestResponse sendInterest(User user, Long targetProfileId) {
        MatrimonyProfile from = profileRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Please create your matrimony profile before sending interest"));
        MatrimonyProfile to = profileRepository.findById(targetProfileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        if (to.getUser().getId().equals(user.getId())) throw new RuntimeException("You cannot send interest to your own profile");
        MatrimonyInterest interest = interestRepository.findByFromProfileAndToProfile(from, to).orElse(null);
        if (interest != null) return new MatrimonyInterestResponse(interest, urlService.baseUrl(), false);
        interest = new MatrimonyInterest();
        interest.setFromProfile(from);
        interest.setToProfile(to);
        interest.setStatus(InterestStatus.SENT);
        MatrimonyInterest saved = interestRepository.save(interest);

        boolean reverse = interestRepository.existsByFromProfileAndToProfile(to, from);
        if (reverse) {
            saved.setStatus(InterestStatus.ACCEPTED);
            interestRepository.save(saved);
            interestRepository.findByFromProfileAndToProfile(to, from).ifPresent(r -> { r.setStatus(InterestStatus.ACCEPTED); interestRepository.save(r); });
            notificationService.create(to.getUser(), "Matrimony Mutual Interest", from.getName() + " accepted your interest. Contact details are now unlocked.", "matrimony_mutual", "heart", "#E63946", "Matrimony", String.valueOf(from.getUser().getId()));
            notificationService.create(user, "Contact Details Unlocked", "Both users are interested. You can now view contact details.", "matrimony_mutual", "lock-open-outline", "#52B788", "Matrimony", String.valueOf(to.getUser().getId()));
        } else {
            notificationService.create(to.getUser(), "New Matrimony Interest", from.getName() + " sent interest to your profile. Accept it to unlock contact details.", "matrimony_interest", "heart-outline", "#E63946", "Matrimony", String.valueOf(from.getUser().getId()));
        }
        return new MatrimonyInterestResponse(saved, urlService.baseUrl(), false);
    }

    @Transactional
    public MatrimonyInterestResponse acceptByUserId(User user, Long profileUserId) {
        MatrimonyProfile my = profileRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Please create your matrimony profile before accepting interest"));
        MatrimonyProfile other = profileRepository.findByUserId(profileUserId).orElseThrow(() -> new RuntimeException("Profile not found"));
        MatrimonyInterest received = interestRepository.findByFromProfileAndToProfile(other, my).orElseThrow(() -> new RuntimeException("Interest request not found"));
        received.setStatus(InterestStatus.ACCEPTED);
        interestRepository.save(received);
        MatrimonyInterest reverse = interestRepository.findByFromProfileAndToProfile(my, other).orElseGet(MatrimonyInterest::new);
        reverse.setFromProfile(my);
        reverse.setToProfile(other);
        reverse.setStatus(InterestStatus.ACCEPTED);
        MatrimonyInterest saved = interestRepository.save(reverse);
        notificationService.create(other.getUser(), "Matrimony Interest Accepted", my.getName() + " accepted your interest. Contact details are now unlocked.", "matrimony_mutual", "heart", "#E63946", "Matrimony", String.valueOf(user.getId()));
        return new MatrimonyInterestResponse(saved, urlService.baseUrl(), false);
    }

    public List<MatrimonyInterestResponse> received(User user) {
        MatrimonyProfile my = profileRepository.findByUser(user).orElse(null);
        if (my == null) return List.of();
        String base = urlService.baseUrl();
        return interestRepository.findByToProfileOrderByCreatedAtDesc(my).stream().map(i -> new MatrimonyInterestResponse(i, base, true)).toList();
    }

    public List<MatrimonyInterestResponse> sent(User user) {
        MatrimonyProfile my = profileRepository.findByUser(user).orElse(null);
        if (my == null) return List.of();
        String base = urlService.baseUrl();
        return interestRepository.findByFromProfileOrderByCreatedAtDesc(my).stream().map(i -> new MatrimonyInterestResponse(i, base, false)).toList();
    }

    private MatrimonyProfileResponse buildResponse(MatrimonyProfile profile, User viewer) {
        boolean own = profile.getUser().getId().equals(viewer.getId());
        MatrimonyProfile viewerProfile = profileRepository.findByUser(viewer).orElse(null);
        boolean sent = false, received = false, mutual = false;
        if (viewerProfile != null && !own) {
            sent = interestRepository.existsByFromProfileAndToProfile(viewerProfile, profile);
            received = interestRepository.existsByFromProfileAndToProfile(profile, viewerProfile);
            mutual = sent && received;
        }
        return new MatrimonyProfileResponse(profile, urlService.baseUrl(), own || mutual, sent, received, mutual);
    }

    private boolean blank(String v) { return v == null || v.trim().isEmpty(); }
}
