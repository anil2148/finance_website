'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { CopilotRequest, DecisionMode, FinancialInputs, Scenario } from '@/lib/money-copilot/types';

const MODES: { value: DecisionMode; label: string; description: string }[] = [
  { value: 'job-offer', label: 'Job Offer', description: 'Compare compensation packages' },
  { value: 'relocation', label: 'Relocation', description: 'Analyze moving to a new state/city' },
  { value: 'debt-payoff', label: 'Debt Payoff', description: 'Debt vs. savings tradeoffs' },
  { value: 'roth-vs-traditional', label: 'Roth vs. Traditional', description: 'Retirement contribution strategy' },
  { value: 'emergency-fund', label: 'Emergency Fund', description: 'How funded are you?' },
  { value: 'home-affordability', label: 'Home Affordability', description: 'What home price can you support?' },
  { value: 'budget-stress-test', label: 'Budget Stress Test', description: 'Can your budget handle income shocks?' },
  { value: 'custom', label: 'Custom Question', description: 'Any financial decision' }
];

const EMPLOYMENT_TYPES = [
  { value: 'w2', label: 'W2 Employee' },
  { value: 'full-time', label: 'Full-time (Salaried)' },
  { value: 'contractor', label: 'Independent Contractor' },
  { value: 'c2c', label: 'Corp-to-Corp (C2C)' }
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA',
  'ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK',
  'OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

function emptyInputs(): FinancialInputs {
  return {};
}

function newScenario(id: string, name: string): Scenario {
  return { id, name, inputs: emptyInputs() };
}

interface IntakeFormProps {
  onSubmit: (request: CopilotRequest) => void;
  isLoading: boolean;
  initialQuestion?: string;
}

export function IntakeForm({ onSubmit, isLoading, initialQuestion = '' }: IntakeFormProps) {
  const [mode, setMode] = useState<DecisionMode>('custom');
  const [question, setQuestion] = useState(initialQuestion);
  const [inputs, setInputs] = useState<FinancialInputs>(emptyInputs());
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [error, setError] = useState('');
  const [showScenarios, setShowScenarios] = useState(false);

  const updateInput = (key: keyof FinancialInputs, value: string | number | undefined) => {
    setInputs((prev) => ({ ...prev, [key]: value === '' ? undefined : value }));
  };

  const addScenario = () => {
    if (scenarios.length >= 2) return;
    const id = `scenario-${Date.now()}`;
    const name = scenarios.length === 0 ? 'Option A' : 'Option B';
    setScenarios((prev) => [...prev, newScenario(id, name)]);
    setShowScenarios(true);
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const updateScenario = (id: string, key: keyof FinancialInputs, value: string | number | undefined) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, inputs: { ...s.inputs, [key]: value === '' ? undefined : value } } : s
      )
    );
  };

  const updateScenarioName = (id: string, name: string) => {
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter your financial question.');
      return;
    }
    setError('');
    onSubmit({ mode, question: question.trim(), inputs, scenarios });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mode selector */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Decision type</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`rounded-xl border p-2.5 text-left transition-all ${
                mode === m.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                  : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800/60'
              }`}
            >
              <p className={`text-xs font-semibold ${mode === m.value ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {m.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-tight">{m.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Question */}
      <Card>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="question">
          Your question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="e.g. Should I move from New Jersey to North Carolina for a lower-paying job?"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </Card>

      {/* Financial inputs */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Your financial details</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            label="Annual salary ($)"
            value={inputs.annualSalary}
            onChange={(v) => updateInput('annualSalary', v)}
            placeholder="e.g. 120000"
          />
          <NumberField
            label="Hourly rate ($/hr)"
            value={inputs.hourlyRate}
            onChange={(v) => updateInput('hourlyRate', v)}
            placeholder="e.g. 75"
          />
          <NumberField
            label="Annual bonus ($)"
            value={inputs.bonus}
            onChange={(v) => updateInput('bonus', v)}
            placeholder="e.g. 10000"
          />
          <SelectField
            label="Employment type"
            value={inputs.employmentType ?? ''}
            onChange={(v) => updateInput('employmentType', v as FinancialInputs['employmentType'])}
            options={[{ value: '', label: 'Select...' }, ...EMPLOYMENT_TYPES]}
          />
          <SelectField
            label="State"
            value={inputs.state ?? ''}
            onChange={(v) => updateInput('state', v)}
            options={[{ value: '', label: 'Select state...' }, ...US_STATES.map((s) => ({ value: s, label: s }))]}
          />
          <TextField
            label="City"
            value={inputs.city ?? ''}
            onChange={(v) => updateInput('city', v)}
            placeholder="e.g. Austin"
          />
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly expenses</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Monthly rent ($)"
              value={inputs.monthlyRent}
              onChange={(v) => updateInput('monthlyRent', v)}
              placeholder="e.g. 2000"
            />
            <NumberField
              label="Monthly mortgage ($)"
              value={inputs.mortgage}
              onChange={(v) => updateInput('mortgage', v)}
              placeholder="e.g. 1800"
            />
            <NumberField
              label="Debt payments ($/mo)"
              value={inputs.debtPayments}
              onChange={(v) => updateInput('debtPayments', v)}
              placeholder="e.g. 400"
            />
            <NumberField
              label="Childcare ($/mo)"
              value={inputs.childcare}
              onChange={(v) => updateInput('childcare', v)}
              placeholder="e.g. 1200"
            />
            <NumberField
              label="Insurance ($/mo)"
              value={inputs.insurance}
              onChange={(v) => updateInput('insurance', v)}
              placeholder="e.g. 350"
            />
            <NumberField
              label="Transportation ($/mo)"
              value={inputs.transportation}
              onChange={(v) => updateInput('transportation', v)}
              placeholder="e.g. 300"
            />
            <NumberField
              label="Groceries ($/mo)"
              value={inputs.groceries}
              onChange={(v) => updateInput('groceries', v)}
              placeholder="e.g. 500"
            />
            <NumberField
              label="Utilities ($/mo)"
              value={inputs.utilities}
              onChange={(v) => updateInput('utilities', v)}
              placeholder="e.g. 150"
            />
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Savings &amp; planning</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Cash on hand / savings ($)"
              value={inputs.cashOnHand}
              onChange={(v) => updateInput('cashOnHand', v)}
              placeholder="e.g. 15000"
            />
            <NumberField
              label="Target emergency months"
              value={inputs.targetEmergencyMonths}
              onChange={(v) => updateInput('targetEmergencyMonths', v)}
              placeholder="e.g. 6"
            />
            <NumberField
              label="Savings rate (%)"
              value={inputs.savingsRate}
              onChange={(v) => updateInput('savingsRate', v)}
              placeholder="e.g. 15"
            />
            <NumberField
              label="Employer 401k match (%)"
              value={inputs.employerMatch}
              onChange={(v) => updateInput('employerMatch', v)}
              placeholder="e.g. 4"
            />
            <NumberField
              label="Current tax rate (%)"
              value={inputs.taxAssumption}
              onChange={(v) => updateInput('taxAssumption', v ? v / 100 : undefined)}
              placeholder="e.g. 22"
            />
            <NumberField
              label="Time horizon (years)"
              value={inputs.timeHorizon}
              onChange={(v) => updateInput('timeHorizon', v)}
              placeholder="e.g. 20"
            />
          </div>
        </div>
      </Card>

      {/* Scenario builder */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Compare scenarios <span className="font-normal text-slate-400">(optional)</span>
          </h3>
          {scenarios.length < 2 && (
            <button
              type="button"
              onClick={addScenario}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700/40 dark:bg-blue-950/30 dark:text-blue-400"
            >
              + Add scenario
            </button>
          )}
        </div>

        {showScenarios && scenarios.length > 0 && (
          <div className="mt-4 space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={scenario.name}
                    onChange={(e) => updateScenarioName(scenario.id, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Scenario name"
                  />
                  <button
                    type="button"
                    onClick={() => removeScenario(scenario.id)}
                    className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField
                    label="Annual salary ($)"
                    value={scenario.inputs.annualSalary}
                    onChange={(v) => updateScenario(scenario.id, 'annualSalary', v)}
                    placeholder="e.g. 110000"
                  />
                  <SelectField
                    label="State"
                    value={scenario.inputs.state ?? ''}
                    onChange={(v) => updateScenario(scenario.id, 'state', v)}
                    options={[{ value: '', label: 'Select state...' }, ...US_STATES.map((s) => ({ value: s, label: s }))]}
                  />
                  <NumberField
                    label="Monthly rent/mortgage ($)"
                    value={scenario.inputs.monthlyRent ?? scenario.inputs.mortgage}
                    onChange={(v) => updateScenario(scenario.id, 'monthlyRent', v)}
                    placeholder="e.g. 1800"
                  />
                  <NumberField
                    label="Monthly debt payments ($)"
                    value={scenario.inputs.debtPayments}
                    onChange={(v) => updateScenario(scenario.id, 'debtPayments', v)}
                    placeholder="e.g. 400"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {scenarios.length === 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Add up to 2 scenarios (e.g. Job A vs. Job B, Stay vs. Move) for side-by-side comparison.
          </p>
        )}
      </Card>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing…' : 'Analyze my decision →'}
      </button>
    </form>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <input
        type="number"
        min="0"
        step="any"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
      />
    </div>
  );
}
