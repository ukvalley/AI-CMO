/**
 * Audience Mapper Component
 *
 * Visualizes ICP → Persona → Product relationships
 * Provides both hierarchical and matrix views
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Target,
  UserCircle,
  Package,
  ChevronRight,
  ChevronDown,
  Link2,
  Grid3X3,
  Network,
  Check,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ICP, Persona, Product } from '@/types/entities';

// ============================================
// TYPES
// ============================================

type ViewMode = 'hierarchy' | 'matrix';
type EntityType = 'icp' | 'persona' | 'product';

interface MappingRelationship {
  fromId: string;
  fromType: EntityType;
  toId: string;
  toType: EntityType;
}

// ============================================
// HIERARCHY VIEW
// ============================================

function HierarchyView({
  icps,
  personas,
  products,
  onLinkPersonaToICP,
  onLinkPersonaToProduct,
  onRemoveLink,
}: {
  icps: ICP[];
  personas: Persona[];
  products: Product[];
  onLinkPersonaToICP: (personaId: string, icpId: string) => void;
  onLinkPersonaToProduct: (personaId: string, productId: string) => void;
  onRemoveLink: (fromId: string, toId: string, type: 'persona-icp' | 'persona-product') => void;
}) {
  const [expandedICPs, setExpandedICPs] = useState<Set<string>>(new Set());
  const [expandedPersonas, setExpandedPersonas] = useState<Set<string>>(new Set());
  const [linkingMode, setLinkingMode] = useState<{ type: 'persona-icp' | 'persona-product'; personaId: string } | null>(null);

  const toggleICP = (id: string) => {
    const newSet = new Set(expandedICPs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedICPs(newSet);
  };

  const togglePersona = (id: string) => {
    const newSet = new Set(expandedPersonas);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedPersonas(newSet);
  };

  const getPersonasForICP = (icpId: string) => personas.filter((p) => p.icpId === icpId);
  const getProductsForPersona = (personaId: string) =>
    products.filter((p) => p.personaIds?.includes(personaId));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-white font-medium">{icps.length} ICPs</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-white font-medium">{personas.length} Personas</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#C8FF2E]" />
            <span className="text-white font-medium">{products.length} Products</span>
          </div>
        </div>
        {linkingMode && (
          <Button variant="secondary" size="sm" onClick={() => setLinkingMode(null)}>
            <X className="w-4 h-4 mr-1" />
            Cancel Linking
          </Button>
        )}
      </div>

      {/* ICP List */}
      <div className="space-y-2">
        {icps.map((icp) => {
          const icpPersonas = getPersonasForICP(icp.id);
          const isExpanded = expandedICPs.has(icp.id);

          return (
            <div key={icp.id} className="bg-[#151920] rounded-xl border border-white/10 overflow-hidden">
              {/* ICP Header */}
              <button
                onClick={() => toggleICP(icp.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-[#C8FF2E]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#878e9a]" />
                )}
                <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#C8FF2E]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">{icp.name}</h3>
                  <p className="text-sm text-[#878e9a]">
                    {icp.industry} • {icp.companySize} • {icpPersonas.length} personas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {icp.priority && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full border ${
                        icp.priority === 'high'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : icp.priority === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          : 'bg-[#878e9a]/10 text-[#878e9a] border-[#878e9a]/30'
                      }`}
                    >
                      {icp.priority} priority
                    </span>
                  )}
                  {icp.fitScore && (
                    <span className="px-2 py-1 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full border border-[#C8FF2E]/30">
                      Fit: {icp.fitScore}%
                    </span>
                  )}
                </div>
              </button>

              {/* Personas under ICP */}
              {isExpanded && (
                <div className="border-t border-white/10 pl-12 pr-4 pb-4 space-y-2">
                  {icpPersonas.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-[#878e9a] text-sm mb-2">No personas linked to this ICP</p>
                    </div>
                  ) : (
                    icpPersonas.map((persona) => {
                      const personaProducts = getProductsForPersona(persona.id);
                      const isPersonaExpanded = expandedPersonas.has(persona.id);

                      return (
                        <div key={persona.id} className="bg-[#1a1d21] rounded-lg border border-white/5">
                          {/* Persona Header */}
                          <button
                            onClick={() => togglePersona(persona.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors rounded-lg"
                          >
                            {isPersonaExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#C8FF2E]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[#878e9a]" />
                            )}
                            <div className="w-8 h-8 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
                              <UserCircle className="w-4 h-4 text-[#C8FF2E]" />
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="font-medium text-white">{persona.name}</h4>
                              <p className="text-xs text-[#878e9a]">
                                {persona.jobTitle} • {persona.department} • {personaProducts.length} products
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {persona.buyingRole && (
                                <span className="px-2 py-0.5 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full">
                                  {persona.buyingRole}
                                </span>
                              )}
                              {persona.budgetAuthority && (
                                <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-full">
                                  Budget Owner
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Products under Persona */}
                          {isPersonaExpanded && (
                            <div className="border-t border-white/5 pl-10 pr-3 pb-3 space-y-2">
                              {personaProducts.length === 0 ? (
                                <div className="py-3 text-center">
                                  <p className="text-[#878e9a] text-xs mb-2">No products mapped</p>
                                  {linkingMode?.type === 'persona-product' &&
                                    linkingMode.personaId === persona.id && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                      {products
                                        .filter((p) => !p.personaIds?.includes(persona.id))
                                        .map((p) => (
                                          <button
                                            key={p.id}
                                            onClick={() => {
                                              onLinkPersonaToProduct(persona.id, p.id);
                                              setLinkingMode(null);
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full border border-[#C8FF2E]/30 hover:bg-[#C8FF2E]/20"
                                          >
                                            <Plus className="w-3 h-3" />
                                            {p.name}
                                          </button>
                                        ))}
                                    </div>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setLinkingMode({ type: 'persona-product', personaId: persona.id })
                                    }
                                  >
                                    <Link2 className="w-3 h-3 mr-1" />
                                    Link Product
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-wrap gap-2">
                                    {personaProducts.map((product) => (
                                      <div
                                        key={product.id}
                                        className="flex items-center gap-2 px-3 py-2 bg-[#151920] rounded-lg border border-white/10"
                                      >
                                        <Package className="w-3 h-3 text-[#C8FF2E]" />
                                        <span className="text-sm text-white">{product.name}</span>
                                        <button
                                          onClick={() =>
                                            onRemoveLink(persona.id, product.id, 'persona-product')
                                          }
                                          className="text-[#878e9a] hover:text-red-400"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setLinkingMode({ type: 'persona-product', personaId: persona.id })
                                    }
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Product
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MATRIX VIEW
// ============================================

function MatrixView({
  icps,
  personas,
  products,
}: {
  icps: ICP[];
  personas: Persona[];
  products: Product[];
}) {
  const [selectedICP, setSelectedICP] = useState<string>('all');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');

  const filteredPersonas = useMemo(() => {
    if (selectedICP === 'all') return personas;
    return personas.filter((p) => p.icpId === selectedICP);
  }, [personas, selectedICP]);

  const filteredProducts = useMemo(() => {
    if (selectedPersona === 'all') return products;
    return products.filter((p) => p.personaIds?.includes(selectedPersona));
  }, [products, selectedPersona]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-[#878e9a] mb-2">Filter by ICP</label>
          <select
            value={selectedICP}
            onChange={(e) => {
              setSelectedICP(e.target.value);
              setSelectedPersona('all');
            }}
            className="px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white text-sm focus:outline-none focus:border-[#C8FF2E]/50"
          >
            <option value="all">All ICPs</option>
            {icps.map((icp) => (
              <option key={icp.id} value={icp.id}>
                {icp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#878e9a] mb-2">Filter by Persona</label>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/10 bg-[#1a1d21] text-white text-sm focus:outline-none focus:border-[#C8FF2E]/50"
          >
            <option value="all">All Personas</option>
            {filteredPersonas.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-[#151920] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-[#1a1d21]">
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#C8FF2E]">Product</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#C8FF2E]">Category</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-[#C8FF2E]">Target ICPs</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-[#C8FF2E]">Target Personas</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-[#C8FF2E]">Audience Fit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((product) => {
              const targetICPs = icps.filter((icp) => product.icpIds?.includes(icp.id));
              const targetPersonas = personas.filter((p) => product.personaIds?.includes(p.id));

              return (
                <tr key={product.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-[#C8FF2E]" />
                      <span className="font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#878e9a]">{product.audienceType}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {targetICPs.length > 0 ? (
                        targetICPs.map((icp) => (
                          <span
                            key={icp.id}
                            className="px-2 py-0.5 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full border border-[#C8FF2E]/30"
                          >
                            {icp.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#686f7e]">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {targetPersonas.length > 0 ? (
                        targetPersonas.map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full border border-[#C8FF2E]/30"
                          >
                            {p.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#686f7e]">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {targetICPs.length > 0 && targetPersonas.length > 0 ? (
                      <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/30">
                        ✓ Mapped
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/30">
                        ⚠ Incomplete
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#151920] rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{icps.length}</p>
              <p className="text-sm text-[#878e9a]">Total ICPs</p>
            </div>
          </div>
        </div>
        <div className="bg-[#151920] rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{personas.length}</p>
              <p className="text-sm text-[#878e9a]">Total Personas</p>
            </div>
          </div>
        </div>
        <div className="bg-[#151920] rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8FF2E]/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#C8FF2E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{products.length}</p>
              <p className="text-sm text-[#878e9a]">Total Products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AudienceMapper({
  icps,
  personas,
  products,
  onLinkPersonaToICP,
  onLinkPersonaToProduct,
  onRemoveLink,
}: {
  icps: ICP[];
  personas: Persona[];
  products: Product[];
  onLinkPersonaToICP: (personaId: string, icpId: string) => void;
  onLinkPersonaToProduct: (personaId: string, productId: string) => void;
  onRemoveLink: (fromId: string, toId: string, type: 'persona-icp' | 'persona-product') => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Audience Mapping</h2>
          <p className="text-[#878e9a]">Visualize ICP → Persona → Product relationships</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1d21] rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'hierarchy'
                ? 'bg-[#C8FF2E] text-[#0d1117]'
                : 'text-[#878e9a] hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            Hierarchy
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              viewMode === 'matrix'
                ? 'bg-[#C8FF2E] text-[#0d1117]'
                : 'text-[#878e9a] hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Matrix
          </button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'hierarchy' ? (
        <HierarchyView
          icps={icps}
          personas={personas}
          products={products}
          onLinkPersonaToICP={onLinkPersonaToICP}
          onLinkPersonaToProduct={onLinkPersonaToProduct}
          onRemoveLink={onRemoveLink}
        />
      ) : (
        <MatrixView icps={icps} personas={personas} products={products} />
      )}
    </div>
  );
}
