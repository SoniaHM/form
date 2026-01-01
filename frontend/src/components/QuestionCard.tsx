import { useState } from 'react';
import './QuestionCard.css';
import type { Question } from '../types';



interface Props {
    mainQuestion: Question;
    allQuestions: Question[];
    onNext: () => void;
    disableNext: boolean;
    onPrevious: () => void;
    disablePrevious: boolean;
    onSave: (answers: { [id: string]: string }) => void;
}

export default function QuestionCard({ mainQuestion, allQuestions, onNext, disableNext, onPrevious, disablePrevious, onSave }: Props) {
    const [answers, setAnswers] = useState<{ [id: string]: string }>({});
    const childrenByParent = allQuestions.reduce<Record<string, Question[]>>(
        (acc, q) => {
            if (q.relatedQuestionId) {
                acc[q.relatedQuestionId] ??= [];
                acc[q.relatedQuestionId].push(q);
            }
            return acc;
        },
        {}
    );
    const renderQuestion = (question: Question) => {
        const children = (childrenByParent[question.id] || [])
            .sort((a, b) => a.orderIndex - b.orderIndex);

        const unit = question.unit ? " (" + question.unit + ")" : "";
        const label = navigator.language.startsWith('fr') ? question.labelFr : question.labelEn;
        if (question.content === "Table") {
            return (
                <div key={question.id} className="question-item">
                    <p className="question-label">{label + unit}</p>
                    <table className="question-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Réponse</th>
                            </tr>
                        </thead>
                        <tbody>
                            {children.map(child => {
                                if (child.content === "Table") {
                                    return null;
                                }
                                return (
                                    <tr key={child.id}>
                                        <td>{(navigator.language.startsWith('fr') ? child.labelFr : child.labelEn) + (child.unit ? " (" + child.unit + ")" : "")}</td>
                                        <td>{renderField(child)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {children.filter(c => c.content === "Table").map(c => renderQuestion(c))}
                </div>
            );
        }
        return (
            <div key={question.id} className="question-item">
                <p className="question-label">{label + unit}</p>
                {renderField(question)}
                {children.map(child => renderQuestion(child))}
            </div>
        );
    };

    const renderField = (question: Question) => {
        const value = answers[question.id] || '';
        const handleChange = (val: string) => setAnswers(prev => ({ ...prev, [question.id]: val }));

        switch (question.content) {
            case "number":
                return <input type="number" value={value} onChange={e => handleChange(e.target.value)} placeholder="Votre réponse" className="question-input" />;
            case "Text":
                return <input type="text" value={value} onChange={e => handleChange(e.target.value)} placeholder="Votre réponse" className="question-input" />;
            case "enum":
                if (!question.enumEn || !question.enumFr) return null;
                const options = (navigator.language.startsWith('fr') ? question.enumFr : question.enumEn)
                    .split(",")
                    .map(opt => opt.trim());
                return (
                    <select value={value} onChange={e => handleChange(e.target.value)} className="question-select">
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                );
            default:
                return null;
        }
    };


    return (
        <div className="question-card">
            {renderQuestion(mainQuestion)}

            <div className="navigation-buttons">
                {!disablePrevious && <button className="next-button" onClick={onPrevious}>Précédent</button>}
                {!disableNext && <button className="next-button" onClick={() => onNext()}>Suivant</button>}
                {disableNext && <button className="next-button" onClick={() => onSave(answers)}>Sauvegarder</button>}
            </div>
        </div>
    );
}


