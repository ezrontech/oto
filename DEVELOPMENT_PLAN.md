# Oto Development Plan & Roadmap

## Core Architecture Principle

**AI Model Abstraction**: Create a pluggable interface allowing users to switch between OpenAI, Google, self-hosted LLMs, or any provider without affecting agents or UI.

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
**High Priority Tasks**
- [x] Complete Phase 6: Interactive Analytics - finish data visualization components and metric drill-downs
- [x] Design AI Model Abstraction Layer - create interface for pluggable LLM providers
- [x] Implement Mock AI Service - simulate AI responses with realistic delays and tool outputs

### Phase 2: Core Features (Week 3-4)
**Medium Priority Tasks**
- [ ] Build Agent Management System - complete persona editor and agent configuration UI
- [ ] Enhance Knowledge Base UI - improve document upload, indexing interface and citation display
- [ ] Implement Tools & Integrations Framework - create UI for connecting external services
- [ ] Create Settings for Model Configuration - UI for switching default AI providers

### Phase 3: Polish & Completion (Week 5-6)
**Lower Priority Tasks**
- [ ] Complete Mobile App Feature Parity - implement all dashboard features in Expo app
- [ ] Add Comprehensive Error Handling - implement error boundaries and user feedback

## Key Design Decisions

1. **Provider Agnostic**: Agents never know which LLM they're using
2. **Swappable Default**: Default model configurable via settings UI
3. **Mock Development**: Mock service provides realistic AI responses during development
4. **Tool Interface**: Unified tool calling system regardless of AI provider
5. **User Choice**: Future users can bring their own API keys/models

## Technical Requirements

### AI Abstraction Layer
- Standardized request/response interface
- Provider-specific adapters (OpenAI, Google, Local LLM)
- Fallback and error handling
- Rate limiting and cost tracking

### Mock Service Features
- Realistic response delays
- Tool execution simulation
- Error state testing
- Conversation memory

### UI Requirements
- Model selection in settings
- API key management
- Usage metrics display
- Provider status indicators

## Progress Tracking

*This document will be updated as tasks are completed*

## Recent Updates

- Added interactive analytics charts to `MyHub` using `InteractiveChart` (initial UI + sample data)
- Added AI abstraction scaffolding in `@oto/config` (`AIModelManager`, `MockAIAdapter`, shared types) and exported via `@oto/config/ai`
- Fixed monorepo root `npm run dev` by adding `dev` script to `apps/mobile`
- Completed Phase 6 analytics: reusable drill-down sheet (`AnalyticsDrilldownSheet`), shared analytics helpers, and interactive analytics on `MyHub` + `Workspace`
- Phase 2 (Agents): Create Agent flow (sheet + create & configure), Interactive Builder (mock persona generation), and file-backed persistence via `/api/agents/*`
- Removed Interactive Builder; users will ask Oto to create agents via conversation. Updated README to describe Oto as personal assistant that delegates/creates agents. Noted backend will use Supabase.

---

**Created**: December 25, 2025  
**Last Updated**: December 25, 2025  
**Status**: Phase 2 Completed
