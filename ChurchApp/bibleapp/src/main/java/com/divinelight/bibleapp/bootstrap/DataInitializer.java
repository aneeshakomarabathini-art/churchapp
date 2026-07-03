package com.divinelight.bibleapp.bootstrap;

import com.divinelight.bibleapp.entity.AccountStatus;
import com.divinelight.bibleapp.entity.Role;
import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public void run(String... args) {
        String email = "admin@gracechurch.com";
        if (!userRepository.existsByEmail(email)) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(email);
            admin.setPhone("9999999999");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setStatus(AccountStatus.ACTIVE);
            userRepository.save(admin);
            System.out.println("Default admin created: admin@gracechurch.com / admin123");
        }
    }
}
