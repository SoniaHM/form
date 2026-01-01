package com.example.form.config;

import com.example.form.model.Question;
import com.example.form.repository.QuestionRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) throws Exception {
        loadQuestionsFromCsv();
    }

    private void loadQuestionsFromCsv() {
        long count = questionRepository.count();
        if (count > 0) {
            return;
        }

        try {
            ClassPathResource resource = new ClassPathResource("data/questions.csv");
            List<Question> questions = parseCSV(resource);
            questionRepository.saveAll(questions);

        } catch (IOException e) {
            log.error("Erreur lors de la lecture du fichier CSV", e);
            throw new RuntimeException("Impossible de charger les questions", e);
        } catch (CsvException e) {
            log.error("Erreur lors du parsing du CSV", e);
            throw new RuntimeException("Format CSV invalide", e);
        }
    }

    private List<Question> parseCSV(ClassPathResource resource) throws IOException, CsvException {
        List<Question> questions = new ArrayList<>();

        try (CSVReader reader = new CSVReaderBuilder(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)).withCSVParser(new CSVParserBuilder().withSeparator(';').build()).build()) {

            List<String[]> rows = reader.readAll();
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    Question question = buildQuestion(row);
                    questions.add(question);
                } catch (Exception e) {
                    log.error("Erreur ligne {} : {}", i, e.getMessage());
                }
            }
        }

        return questions;
    }

    private Question buildQuestion(String[] row) {
        Question q = new Question();
        q.setId(row[0].trim());
        q.setLabelEn(row[1].trim());
        q.setLabelFr(row[2].trim());
        q.setContent(row[3].trim());

        String related = row[4].trim();
        q.setRelatedQuestionId(related.isEmpty() ? null : related);

        q.setOrderIndex(row[5].trim().isEmpty() ? 0 : Integer.parseInt(row[5].trim()));

        String unit = row[6].trim();
        q.setUnit(unit.isEmpty() ? null : unit);

        if (row.length > 7 && !row[7].trim().isEmpty()) {
            q.setEnumEn(row[7].trim());
        }
        if (row.length > 8 && !row[8].trim().isEmpty()) {
            q.setEnumFr(row[8].trim());
        }

        return q;
    }
}