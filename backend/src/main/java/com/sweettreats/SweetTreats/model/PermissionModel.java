package com.sweettreats.SweetTreats.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PermissionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private String name;
}
