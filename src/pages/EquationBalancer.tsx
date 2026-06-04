import React, { useState, useCallback } from 'react';
import { FlaskConical, ArrowRight, RotateCcw, Info, Beaker, CheckCircle2 } from 'lucide-react';
import type { EquationData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

// 将化学式中的数字渲染为下标
function renderFormula(formula: string) {
  const parts: (string | React.ReactElement)[] = [];
  let buffer = '';
  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    if (/\d/.test(char)) {
      if (buffer) {
        parts.push(buffer);
        buffer = '';
      }
      parts.push(<sub key={`${i}-${char}`} className="text-[0.75em]">{char}</sub>);
    } else {
      buffer += char;
    }
  }
  if (buffer) parts.push(buffer);
  return <>{parts}</>;
}

export default function EquationBalancer() {
  const [reactantsInput, setReactantsInput] = useState('');
  const [productsInput, setProductsInput] = useState('');
  const [data, setData] = useState<EquationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!reactantsInput.trim() || !productsInput.trim()) {
      setError('请填写反应物和生成物');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `https://cn.apihz.cn/api/other/hxfcs.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91&reactants=${encodeURIComponent(reactantsInput)}&products=${encodeURIComponent(productsInput)}`;
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [reactantsInput, productsInput]);

  const handleReset = useCallback(() => {
    setReactantsInput('');
    setProductsInput('');
    setData(null);
    setError(null);
  }, []);

  const fillExample = useCallback((reactants: string, products: string) => {
    setReactantsInput(reactants);
    setProductsInput(products);
    setData(null);
    setError(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
            <FlaskConical size={20} className="text-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">化学方程式配平</h1>
            <p className="text-sm text-muted">输入反应物与生成物，智能配平方程式</p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Reactants Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
              <Beaker size={16} className="text-teal" />
              反应物
            </label>
            <input
              type="text"
              value={reactantsInput}
              onChange={(e) => setReactantsInput(e.target.value)}
              placeholder="例: H2, O2"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-ivory/50 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
            <p className="text-xs text-muted mt-1.5">多个反应物用英文逗号分隔，注意大小写</p>
          </div>

          {/* Products Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
              <CheckCircle2 size={16} className="text-amber" />
              生成物
            </label>
            <input
              type="text"
              value={productsInput}
              onChange={(e) => setProductsInput(e.target.value)}
              placeholder="例: H2O"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-ivory/50 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber transition-all"
            />
            <p className="text-xs text-muted mt-1.5">多个生成物用英文逗号分隔，注意大小写</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={fetchBalance}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-ink text-white rounded-xl hover:bg-ink/90 transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60"
          >
            <FlaskConical size={16} className={loading ? 'animate-spin' : ''} />
            <span>开始配平</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-ink rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <RotateCcw size={14} />
            <span>重置</span>
          </button>
        </div>

        {/* Examples */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-muted mb-2.5">
            <Info size={13} />
            <span>快捷示例</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '氢气燃烧', reactants: 'H2, O2', products: 'H2O' },
              { label: '铁锈生成', reactants: 'Fe, O2', products: 'Fe2O3' },
              { label: '甲烷燃烧', reactants: 'CH4, O2', products: 'CO2, H2O' },
              { label: '高锰酸钾分解', reactants: 'KMnO4', products: 'K2MnO4, MnO2, O2' },
            ].map((ex) => (
              <button
                key={ex.label}
                onClick={() => fillExample(ex.reactants, ex.products)}
                className="px-3 py-1.5 text-xs rounded-lg bg-teal/10 text-teal hover:bg-teal/20 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingCard />}

      {/* Result */}
      {data && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Main Equation Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              {/* Label */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-teal/15 flex items-center justify-center">
                  <FlaskConical size={28} className="text-teal" />
                </div>
              </div>

              {/* Equation */}
              <div className="text-center mb-8">
                <p className="text-xs text-muted mb-3 tracking-wider uppercase">Balanced Equation</p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-2xl md:text-4xl font-bold text-ink font-mono leading-relaxed">
                  {data.reactants.map((r, i) => (
                    <span key={`r-${i}`} className="flex items-center">
                      {i > 0 && <span className="mx-2 text-muted font-normal">+</span>}
                      <span className="bg-teal/10 px-2 py-1 rounded-lg">
                        {renderFormula(`${r.coefficient === 1 ? '' : r.coefficient}${r.formula}`)}
                      </span>
                    </span>
                  ))}
                  <ArrowRight size={28} className="mx-2 text-amber" />
                  {data.products.map((p, i) => (
                    <span key={`p-${i}`} className="flex items-center">
                      {i > 0 && <span className="mx-2 text-muted font-normal">+</span>}
                      <span className="bg-amber/10 px-2 py-1 rounded-lg">
                        {renderFormula(`${p.coefficient === 1 ? '' : p.coefficient}${p.formula}`)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-teal/30" />
                <div className="w-2 h-2 rounded-full bg-teal/50" />
                <div className="h-px w-12 bg-teal/30" />
              </div>

              {/* Full equation text */}
              <div className="bg-ivory rounded-xl p-5 md:p-6 text-center">
                <p className="text-xs text-muted mb-2">完整配平结果</p>
                <p className="text-lg md:text-xl font-mono text-ink tracking-wide">
                  {data.fcsall}
                </p>
              </div>
            </div>
          </div>

          {/* Coefficients Table */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-base font-medium text-ink mb-5 flex items-center gap-2">
              <Info size={18} className="text-teal" />
              配平系数明细
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Reactants */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-teal/10 px-4 py-2.5 text-sm font-medium text-teal flex items-center gap-2">
                  <Beaker size={14} />
                  反应物
                </div>
                <div className="divide-y divide-gray-50">
                  {data.reactants.map((r, i) => (
                    <div key={`rt-${i}`} className="flex items-center justify-between px-4 py-3">
                      <span className="font-mono text-ink font-medium text-lg">
                        {renderFormula(r.formula)}
                      </span>
                      <span className="text-sm text-muted">系数</span>
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md bg-teal/10 text-teal font-bold text-sm">
                        {r.coefficient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-amber/10 px-4 py-2.5 text-sm font-medium text-amber flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  生成物
                </div>
                <div className="divide-y divide-gray-50">
                  {data.products.map((p, i) => (
                    <div key={`pt-${i}`} className="flex items-center justify-between px-4 py-3">
                      <span className="font-mono text-ink font-medium text-lg">
                        {renderFormula(p.formula)}
                      </span>
                      <span className="text-sm text-muted">系数</span>
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md bg-amber/10 text-amber font-bold text-sm">
                        {p.coefficient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Raw JSON (collapsible, optional) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <details className="group">
              <summary className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none hover:text-ink transition-colors">
                <Info size={14} />
                查看原始接口数据
                <span className="ml-auto text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <pre className="mt-3 p-4 bg-ivory rounded-xl text-xs text-ink overflow-auto font-mono leading-relaxed">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      <ChatPanel section="equation-balancer" currentData={data} />
    </div>
  );
}
