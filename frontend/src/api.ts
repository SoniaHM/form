export const fetchQuestions = async () => {
    const res = await fetch('/api/questions');
    if (!res.ok) throw new Error('Erreur fetch questions');
    return res.json();
};

export const saveAnswers = async (answers: { questionId: string, content: string, sessionId: string }[]) => {
    const res = await fetch('/api/answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    });
    if (!res.ok) throw new Error('Erreur saving answers');
    return;
};
