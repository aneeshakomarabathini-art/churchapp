package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.NotificationResponse;
import com.divinelight.bibleapp.entity.Notification;
import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.repository.NotificationRepository;
import com.divinelight.bibleapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification create(User toUser, String title, String message, String type, String icon, String iconColor, String screen, String relatedId) {
        Notification n = new Notification();
        n.setToUser(toUser);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setIcon(icon);
        n.setIconColor(iconColor);
        n.setScreen(screen);
        n.setRelatedId(relatedId);
        return notificationRepository.save(n);
    }

    public void createForAllUsers(String title, String message, String type, String icon, String iconColor, String screen, String relatedId) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("ROLE_USER"))
                .forEach(u -> create(u, title, message, type, icon, iconColor, screen, relatedId));
    }

    public List<NotificationResponse> myNotifications(User user) {
        return notificationRepository.findByToUserOrderByCreatedAtDesc(user)
                .stream().map(NotificationResponse::new).toList();
    }

    public NotificationResponse markRead(User user, Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!n.getToUser().getId().equals(user.getId())) throw new RuntimeException("Notification not found");
        n.setReadAt(LocalDateTime.now());
        return new NotificationResponse(notificationRepository.save(n));
    }

    public void markAllRead(User user) {
        notificationRepository.findByToUserOrderByCreatedAtDesc(user).forEach(n -> {
            if (n.getReadAt() == null) {
                n.setReadAt(LocalDateTime.now());
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void clear(User user) { notificationRepository.deleteByToUser(user); }
}
