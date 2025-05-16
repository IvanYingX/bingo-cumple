'use client';
import { useState } from 'react';

const CreateGameForm = () => {
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([{ question: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);

    // Auto-add a new blank question if typing in the last one
    if (index === questions.length - 1 && value.trim() !== '') {
      setQuestions([...updated, { question: '' }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Remove empty questions
    const validQuestions = questions
      .map((q) => q.question.trim())
      .filter((q) => q !== '')
      .map((q) => ({ question: q }));

    if (validQuestions.length < 20) {
      setError('Debes proporcionar al menos 20 preguntas con contenido.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, questions: validQuestions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear el juego');
      }

      setName('');
      setQuestions([{ question: '' }]);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-2">Crear nuevo juego</h2>

      <input
        type="text"
        placeholder="Nombre del juego"
        className="w-full border px-3 py-2 rounded mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Preguntas ({questions.length - 1} llenadas)</h3>
        {questions.map((q, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Pregunta ${i + 1}`}
            className="w-full border px-3 py-2 rounded mb-2"
            value={q.question}
            onChange={(e) => handleQuestionChange(i, e.target.value)}
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-teal-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? 'Creando...' : 'Crear juego'}
      </button>

      {success && <p className="text-green-600 mt-2">Juego creado correctamente.</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default CreateGameForm;
