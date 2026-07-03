// package com.divinelight.bibleapp.service;

// import com.divinelight.bibleapp.dto.*;
// import com.divinelight.bibleapp.entity.*;
// import com.divinelight.bibleapp.repository.ChurchRepository;
// import com.divinelight.bibleapp.repository.UserRepository;
// import com.divinelight.bibleapp.security.JwtService;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.multipart.MultipartFile;

// @Service
// public class AuthService {
//     private final UserRepository userRepository;
//     private final ChurchRepository churchRepository;
//     private final PasswordEncoder passwordEncoder;
//     private final JwtService jwtService;
//     private final FileStorageService fileStorageService;

//     public AuthService(
//             UserRepository userRepository,
//             ChurchRepository churchRepository,
//             PasswordEncoder passwordEncoder,
//             JwtService jwtService,
//             FileStorageService fileStorageService
//     ) {
//         this.userRepository = userRepository;
//         this.churchRepository = churchRepository;
//         this.passwordEncoder = passwordEncoder;
//         this.jwtService = jwtService;
//         this.fileStorageService = fileStorageService;
//     }

//     public AuthResponse registerUser(RegisterRequest request) {
//         validateRegister(request);
//         String email = request.getEmail().toLowerCase().trim();
//         if (userRepository.existsByEmail(email)) throw new RuntimeException("Email already registered");
//         User user = new User();
//         user.setName(request.getName().trim());
//         user.setEmail(email);
//         user.setPhone(request.getPhone().trim());
//         user.setPassword(passwordEncoder.encode(request.getPassword()));
//         user.setRole(Role.ROLE_USER);
//         user.setStatus(AccountStatus.ACTIVE);
//         User saved = userRepository.save(user);
//         String token = jwtService.generateToken(saved);
//         return new AuthResponse(token, "User registered successfully", new UserResponse(saved));
//     }

//     @Transactional
//     public AuthResponse registerChurchAdmin(ChurchRegisterRequest request, MultipartFile churchPhoto) {
//         validateChurchRegister(request, churchPhoto);
//         String email = request.getEmail().toLowerCase().trim();
//         if (userRepository.existsByEmail(email)) throw new RuntimeException("Email already registered");

//         User user = new User();
//         user.setName(request.getName().trim());
//         user.setEmail(email);
//         user.setPhone(request.getPhone().trim());
//         user.setPassword(passwordEncoder.encode(request.getPassword()));
//         user.setRole(Role.ROLE_CHURCH_ADMIN);
//         user.setStatus(AccountStatus.PENDING);
//         User savedUser = userRepository.save(user);

//         String photoPath = fileStorageService.store(churchPhoto, "churches");

//         Church church = new Church();
//         church.setChurchName(request.getChurchName().trim());
//         church.setChurchLocation(request.getChurchLocation().trim());
//         church.setChurchAddress(request.getChurchAddress().trim());
//         church.setChurchPhone(request.getChurchPhone().trim());
//         church.setChurchEmail(blank(request.getChurchEmail()) ? email : request.getChurchEmail().trim().toLowerCase());
//         church.setChurchTiming(blank(request.getChurchTiming()) ? "Sunday 9:00 AM and 6:00 PM" : request.getChurchTiming().trim());
//         church.setChurchAbout(blank(request.getChurchAbout()) ? "Church details will be updated by the church admin." : request.getChurchAbout().trim());
//         church.setChurchPosterPath(photoPath);
//         church.setStatus(ChurchStatus.PENDING);
//         church.setAdminUser(savedUser);
//         Church savedChurch = churchRepository.save(church);

//         return new AuthResponse(null, "Church admin registration submitted. Please wait for admin approval.", new UserResponse(savedUser, savedChurch));
//     }

//     public AuthResponse login(LoginRequest request) {
//         validateLogin(request);
//         User user = getUserByEmail(request.getEmail());
//         if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) throw new RuntimeException("Invalid email or password");
//         if (user.getStatus() == AccountStatus.PENDING) throw new RuntimeException("Your account is pending admin approval");
//         if (user.getStatus() == AccountStatus.REJECTED) throw new RuntimeException("Your account has been rejected");
//         Church church = churchRepository.findByAdminUser(user).orElse(null);
//         return new AuthResponse(jwtService.generateToken(user), "Login successful", new UserResponse(user, church));
//     }

//     public AuthResponse adminLogin(LoginRequest request) {
//         AuthResponse response = login(request);
//         User user = getUserByEmail(request.getEmail());
//         if (user.getRole() != Role.ROLE_ADMIN) throw new RuntimeException("Only admin can login here");
//         return new AuthResponse(response.getToken(), "Admin login successful", response.getUser());
//     }

//     public UserResponse me(String email) {
//         User user = getUserByEmail(email);
//         Church church = churchRepository.findByAdminUser(user).orElse(null);
//         return new UserResponse(user, church);
//     }

//     private User getUserByEmail(String email) {
//         if (blank(email)) throw new RuntimeException("Email is required");
//         return userRepository.findByEmail(email.toLowerCase().trim()).orElseThrow(() -> new RuntimeException("User not found"));
//     }

//     private boolean blank(String v) { return v == null || v.trim().isEmpty(); }

//     private void validateLogin(LoginRequest r) {
//         if (r == null) throw new RuntimeException("Request body is required");
//         if (blank(r.getEmail())) throw new RuntimeException("Email is required");
//         if (blank(r.getPassword())) throw new RuntimeException("Password is required");
//     }

//     private void validateRegister(RegisterRequest r) {
//         if (r == null) throw new RuntimeException("Request body is required");
//         if (blank(r.getName())) throw new RuntimeException("Name is required");
//         if (blank(r.getEmail())) throw new RuntimeException("Email is required");
//         if (blank(r.getPhone())) throw new RuntimeException("Phone number is required");
//         if (r.getPassword() == null || r.getPassword().length() < 6) throw new RuntimeException("Password must be at least 6 characters");
//     }

//     private void validateChurchRegister(ChurchRegisterRequest r, MultipartFile churchPhoto) {
//         if (r == null) throw new RuntimeException("Request body is required");
//         if (blank(r.getName())) throw new RuntimeException("Name is required");
//         if (blank(r.getEmail())) throw new RuntimeException("Email is required");
//         if (blank(r.getPhone())) throw new RuntimeException("Phone number is required");
//         if (r.getPassword() == null || r.getPassword().length() < 6) throw new RuntimeException("Password must be at least 6 characters");
//         if (blank(r.getChurchName())) throw new RuntimeException("Church name is required");
//         if (blank(r.getChurchLocation())) throw new RuntimeException("Church location is required");
//         if (blank(r.getChurchAddress())) throw new RuntimeException("Church address is required");
//         if (blank(r.getChurchPhone())) throw new RuntimeException("Church phone is required");
//         if (blank(r.getChurchEmail())) throw new RuntimeException("Church email is required");
//         if (blank(r.getChurchTiming())) throw new RuntimeException("Church timings are required");
//         if (churchPhoto == null || churchPhoto.isEmpty()) throw new RuntimeException("Church photo is required");
//     }
// }  





























package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.*;
import com.divinelight.bibleapp.entity.*;
import com.divinelight.bibleapp.repository.ChurchRepository;
import com.divinelight.bibleapp.repository.UserRepository;
import com.divinelight.bibleapp.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final ChurchRepository churchRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final FileStorageService fileStorageService;

    public AuthService(
            UserRepository userRepository,
            ChurchRepository churchRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.churchRepository = churchRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.fileStorageService = fileStorageService;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        validateRegister(request);
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) throw new RuntimeException("Email already registered");
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setStatus(AccountStatus.ACTIVE);
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, "User registered successfully", new UserResponse(saved));
    }

    @Transactional
    public AuthResponse registerChurchAdmin(ChurchRegisterRequest request, MultipartFile churchPhoto) {
        validateChurchRegister(request, churchPhoto);
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) throw new RuntimeException("Email already registered");

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_CHURCH_ADMIN);
        user.setStatus(AccountStatus.PENDING);
        User savedUser = userRepository.save(user);

        String photoPath = fileStorageService.store(churchPhoto, "churches");

        Church church = new Church();
        church.setChurchName(request.getChurchName().trim());
        church.setChurchLocation(request.getChurchLocation().trim());
        church.setChurchAddress(request.getChurchAddress().trim());
        church.setChurchPhone(request.getChurchPhone().trim());
        church.setChurchEmail(blank(request.getChurchEmail()) ? email : request.getChurchEmail().trim().toLowerCase());
        church.setChurchTiming(blank(request.getChurchTiming()) ? "Sunday 9:00 AM and 6:00 PM" : request.getChurchTiming().trim());
        church.setChurchAbout(blank(request.getChurchAbout()) ? "Church details will be updated by the church admin." : request.getChurchAbout().trim());
        church.setChurchPosterPath(photoPath);
        church.setStatus(ChurchStatus.PENDING);
        church.setAdminUser(savedUser);
        Church savedChurch = churchRepository.save(church);

        return new AuthResponse(null, "Church admin registration submitted. Please wait for admin approval.", new UserResponse(savedUser, savedChurch));
    }

    public AuthResponse login(LoginRequest request) {
        validateLogin(request);
        User user = getUserByEmail(request.getEmail());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) throw new RuntimeException("Invalid email or password");
        if (user.getStatus() == AccountStatus.PENDING) throw new RuntimeException("Your account is pending admin approval");
        if (user.getStatus() == AccountStatus.REJECTED) throw new RuntimeException("Your account has been rejected");
        Church church = churchRepository.findByAdminUser(user).orElse(null);
        return new AuthResponse(jwtService.generateToken(user), "Login successful", new UserResponse(user, church));
    }

    public AuthResponse adminLogin(LoginRequest request) {
        AuthResponse response = login(request);
        User user = getUserByEmail(request.getEmail());
        if (user.getRole() != Role.ROLE_ADMIN) throw new RuntimeException("Only admin can login here");
        return new AuthResponse(response.getToken(), "Admin login successful", response.getUser());
    }

    public UserResponse me(String email) {
        User user = getUserByEmail(email);
        Church church = churchRepository.findByAdminUser(user).orElse(null);
        return new UserResponse(user, church);
    }

    private User getUserByEmail(String email) {
        if (blank(email)) throw new RuntimeException("Email is required");
        return userRepository.findByEmail(email.toLowerCase().trim()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private boolean blank(String v) { return v == null || v.trim().isEmpty(); }

    private void validateLogin(LoginRequest r) {
        if (r == null) throw new RuntimeException("Request body is required");
        if (blank(r.getEmail())) throw new RuntimeException("Email is required");
        if (blank(r.getPassword())) throw new RuntimeException("Password is required");
    }

    private void validateRegister(RegisterRequest r) {
        if (r == null) throw new RuntimeException("Request body is required");
        if (blank(r.getName())) throw new RuntimeException("Name is required");
        if (blank(r.getEmail())) throw new RuntimeException("Email is required");
        if (blank(r.getPhone())) throw new RuntimeException("Phone number is required");
        if (r.getPassword() == null || r.getPassword().length() < 6) throw new RuntimeException("Password must be at least 6 characters");
    }

    private void validateChurchRegister(ChurchRegisterRequest r, MultipartFile churchPhoto) {
        if (r == null) throw new RuntimeException("Request body is required");
        if (blank(r.getName())) throw new RuntimeException("Name is required");
        if (blank(r.getEmail())) throw new RuntimeException("Email is required");
        if (blank(r.getPhone())) throw new RuntimeException("Phone number is required");
        if (r.getPassword() == null || r.getPassword().length() < 6) throw new RuntimeException("Password must be at least 6 characters");
        if (blank(r.getChurchName())) throw new RuntimeException("Church name is required");
        if (blank(r.getChurchLocation())) throw new RuntimeException("Church location is required");
        if (blank(r.getChurchAddress())) throw new RuntimeException("Church address is required");
        if (blank(r.getChurchPhone())) throw new RuntimeException("Church phone is required");
        if (blank(r.getChurchEmail())) throw new RuntimeException("Church email is required");
        if (blank(r.getChurchTiming())) throw new RuntimeException("Church timings are required");
    }
}
