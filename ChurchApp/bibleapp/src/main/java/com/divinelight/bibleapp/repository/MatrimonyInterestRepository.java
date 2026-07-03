package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.MatrimonyInterest;
import com.divinelight.bibleapp.entity.MatrimonyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatrimonyInterestRepository extends JpaRepository<MatrimonyInterest, Long> {
    Optional<MatrimonyInterest> findByFromProfileAndToProfile(MatrimonyProfile fromProfile, MatrimonyProfile toProfile);
    boolean existsByFromProfileAndToProfile(MatrimonyProfile fromProfile, MatrimonyProfile toProfile);
    List<MatrimonyInterest> findByFromProfileOrderByCreatedAtDesc(MatrimonyProfile fromProfile);
    List<MatrimonyInterest> findByToProfileOrderByCreatedAtDesc(MatrimonyProfile toProfile);
}
