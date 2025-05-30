'use client';
import { useState, useEffect } from 'react';
import { useGetGameFromIdQuery } from '@/lib/features/gameSlice';
import { Trash } from 'lucide-react'; // ✅ Import Trash icon

interface CreateGameFormProps {
  gameId?: string;
}

const CreateGameForm = ({ gameId }: CreateGameFormProps) => {
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([{ question: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: gameData } = useGetGameFromIdQuery(gameId || '');

  useEffect(() => {
  if (
    gameId &&
    gameData &&
    !name &&
    questions.length === 1 &&
    questions[0].question === ''
  ) {
    setName(gameData.name);
    setQuestions([
      ...gameData.questions.map((q) => ({ ...q })),
      { question: '' }, // add empty question
    ]);
  }
}, [gameData]);


  const [error, setError] = useState('');

  const handleQuestionChange = (index: number, value: string) => {
    const updated = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuestions(updated);

    if (index === questions.length - 1 && value.trim() !== '') {
      setQuestions([...updated, { question: '' }]);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated.length > 0 ? updated : [{ question: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validQuestions = questions
      .map((q) => q.question.trim())
      .filter((q) => q !== '')
      .map((q) => ({ question: q }));

    if (validQuestions.length < 2) {
      setError('Debes proporcionar al menos 2 preguntas con contenido.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, questions: validQuestions, gameId }),
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
        {questions.map((q, i) => {
          const isLastEmpty =
            i === questions.length - 1 && q.question.trim() === '';
          const canDelete = questions.length > 1 && !isLastEmpty;

          return (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder={`Pregunta ${i + 1}`}
                className="flex-1 border px-3 py-2 rounded"
                value={q.question}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
              />
              {canDelete && (
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(i)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar pregunta"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
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
