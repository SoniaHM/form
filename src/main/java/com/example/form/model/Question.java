package com.example.form.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Question {
    @Id
    private String id;

    private String labelEn;
    private String labelFr;
    private String content; // "number", "text", "enum", "table", ""

    @Column(name = "related_question_id")
    private String relatedQuestionId;

    @Column(name = "order_index")
    private Integer orderIndex;

    private String unit;

    @Column(length = 1000)
    private String enumEn;

    @Column(length = 1000)
    private String enumFr;
}