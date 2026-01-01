export interface Question {
    id: string;
    labelEn: string;
    labelFr: string;
    content: string;
    relatedQuestionId: string;
    orderIndex: number;
    unit: string;
    enumEn: string;
    enumFr: string;
}
