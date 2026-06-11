import React, { useState, useCallback } from 'react';
import { FlaskConical, ArrowRight, RotateCcw, Info, Beaker, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import type { EquationData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, ActionButton, SectionTitle, OrnamentDivider } from '../components/UI';

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
      <PageHeader
        icon={FlaskConical}
        title="化学方程式配平"
        description="输入反应物与生成物，智能配平方程式"
        accent="teal"
      >
        <ActionButton
          onClick={handleReset}
          variant="ghost"
          size="md"
          icon={<RotateCcw size={15} />}
        >
          重置
        </ActionButton>
        <ActionButton
          onClick={fetchBalance}
          loading={loading}
          variant="primary"
          size="md"
          icon={<Zap size={15} />}
        >
          开始配平
        </ActionButton>
      </PageHeader>

      {/* Input Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Reactants Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2.5">
              <span className="w-6 h-6 rounded-md bg-teal/12 text-teal flex items-center justify-center">
                <Beaker size={13} />
              </span>
              <span>反应物</span>
              <span className="text-xs text-muted/50 font-normal">Reactants</span>
            </label>
            <input
              type="text"
              value={reactantsInput}
              onChange={(e) => setReactantsInput(e.target.value)}
              placeholder="例: H2, O2"
              className="w-full px-4 py-3 rounded-xl border border-line bg-ivory/40 text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal/40 focus:bg-white transition-all duration-200"
            />
            <p className="text-xs text-muted/60 mt-2 leading-relaxed">多个反应物用英文逗号分隔，注意大小写</p>
          </div>

          {/* Products Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2.5">
              <span className="w-6 h-6 rounded-md bg-amber/15 text-amber-deep flex items-center justify-center">
                <CheckCircle2 size={13} />
              </span>
              <span>生成物</span>
              <span className="text-xs text-muted/50 font-normal">Products</span>
            </label>
            <input
              type="text"
              value={productsInput}
              onChange={(e) => setProductsInput(e.target.value)}
              placeholder="例: H2O"
              className="w-full px-4 py-3 rounded-xl border border-line bg-ivory/40 text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-amber/25 focus:border-amber/40 focus:bg-white transition-all duration-200"
            />
            <p className="text-xs text-muted/60 mt-2 leading-relaxed">多个生成物用英文逗号分隔，注意大小写</p>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-7 pt-6 border-t border-line-soft">
          <div className="flex items-center gap-2 text-xs text-muted mb-3">
            <Sparkles size={13} className="text-amber" />
            <span className="font-medium">快捷示例 · 一键填入</span>
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
                className="px-3.5 py-1.5 text-xs rounded-lg bg-teal/8 text-teal border border-teal/15 hover:bg-teal/15 hover:border-teal/25 transition-all duration-200 active:scale-95 font-medium"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorState message={error} onRetry={fetchBalance} />}

      {/* Loading */}
      {loading && <LoadingCard />}

      {/* Result */}
      {data && !loading && (
        <div className="space-y-5 stagger-children">
          {/* Main Equation Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-card border border-line-soft overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-teal/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />

            <div className="relative">
              {/* Header Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal/20 rounded-2xl blur-xl scale-125" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/15 to-teal/5 flex items-center justify-center border border-teal/20 shadow-glow-amber">
                    <FlaskConical size={30} className="text-teal" strokeWidth={1.8} />
                  </div>
                </div>
              </div>

              {/* Label */}
              <p className="text-center text-xs text-muted/60 mb-4 tracking-[0.2em] uppercase font-mono">
                Balanced Equation · 配平结果
              </p>

              {/* Equation */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-2xl md:text-4xl font-bold text-ink font-mono leading-relaxed mb-8">
                {data.reactants.map((r, i) => (
                  <span key={`r-${i}`} className="flex items-center">
                    {i > 0 && <span className="mx-2 text-muted/40 font-normal text-2xl">+</span>}
                    <span className="bg-teal/10 px-2.5 py-1 rounded-lg border border-teal/10">
                      {renderFormula(`${r.coefficient === 1 ? '' : r.coefficient}${r.formula}`)}
                    </span>
                  </span>
                ))}
                <span className="mx-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber/15 border border-amber/20">
                  <ArrowRight size={22} className="text-amber-deep" strokeWidth={2.2} />
                </span>
                {data.products.map((p, i) => (
                  <span key={`p-${i}`} className="flex items-center">
                    {i > 0 && <span className="mx-2 text-muted/40 font-normal text-2xl">+</span>}
                    <span className="bg-amber/10 px-2.5 py-1 rounded-lg border border-amber/10">
                      {renderFormula(`${p.coefficient === 1 ? '' : p.coefficient}${p.formula}`)}
                    </span>
                  </span>
                ))}
              </div>

              <OrnamentDivider className="my-4" />

              {/* Full equation text */}
              <div className="bg-gradient-to-br from-ivory to-ivory-soft rounded-xl p-6 text-center border border-amber/10">
                <p className="text-xs text-muted/60 mb-2.5 tracking-wider">完整配平结果</p>
                <p className="text-lg md:text-xl font-mono text-ink tracking-wide leading-relaxed">
                  {data.fcsall}
                </p>
              </div>
            </div>
          </div>

          {/* Coefficients Table */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
            <SectionTitle
              icon={Info}
              title="配平系数明细"
              accent="teal"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Reactants */}
              <div className="rounded-xl border border-teal/15 overflow-hidden bg-gradient-to-br from-teal/5 to-transparent">
                <div className="bg-teal/10 px-4 py-2.5 text-sm font-semibold text-teal flex items-center gap-2 border-b border-teal/10">
                  <Beaker size={14} />
                  反应物
                </div>
                <div className="divide-y divide-teal/8">
                  {data.reactants.map((r, i) => (
                    <div key={`rt-${i}`} className="flex items-center justify-between px-4 py-3 hover:bg-teal/5 transition-colors">
                      <span className="font-mono text-ink font-medium text-lg">
                        {renderFormula(r.formula)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted/60">系数</span>
                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2.5 py-1 rounded-md bg-teal/15 text-teal font-bold text-sm border border-teal/20">
                          {r.coefficient}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="rounded-xl border border-amber/15 overflow-hidden bg-gradient-to-br from-amber/5 to-transparent">
                <div className="bg-amber/10 px-4 py-2.5 text-sm font-semibold text-amber-deep flex items-center gap-2 border-b border-amber/10">
                  <CheckCircle2 size={14} />
                  生成物
                </div>
                <div className="divide-y divide-amber/8">
                  {data.products.map((p, i) => (
                    <div key={`pt-${i}`} className="flex items-center justify-between px-4 py-3 hover:bg-amber/5 transition-colors">
                      <span className="font-mono text-ink font-medium text-lg">
                        {renderFormula(p.formula)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted/60">系数</span>
                        <span className="inline-flex items-center justify-center min-w-[2.25rem] px-2.5 py-1 rounded-md bg-amber/15 text-amber-deep font-bold text-sm border border-amber/20">
                          {p.coefficient}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Raw JSON (collapsible) */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
            <details className="group">
              <summary className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none hover:text-ink transition-colors list-none">
                <span className="w-6 h-6 rounded-md bg-ink/8 text-ink/60 flex items-center justify-center">
                  <Info size={12} />
                </span>
                <span className="font-medium">查看原始接口数据</span>
                <span className="ml-auto text-muted/40 group-open:rotate-180 transition-transform duration-200">▼</span>
              </summary>
              <pre className="mt-3 p-4 bg-ivory-soft rounded-xl text-xs text-ink overflow-auto font-mono leading-relaxed border border-line-soft">
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
