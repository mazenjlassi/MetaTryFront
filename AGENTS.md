# AGENTS.md

## Commands

```bash
npm start           # Dev server at http://localhost:4200
npm run build      # Production build to dist/
npm test           # Karma unit tests
```

## Architecture

- **Entry**: `src/main.ts` → `src/app/app.config.ts` → routes in `src/app/app.routes.ts`
- **Routing**: Lazy routes via Angular Router (no lazy loading configured)
- **HTTP**: `provideHttpClient(withInterceptors([authInterceptor]))` in `app.config.ts`
- **Auth**: Token injected via `src/app/interceptors/auth.interceptor.ts`
- **Icons**: Lucide Angular (`lucide-angular` package) - icons imported from module

## Pages

| Route | Component |
|------|-----------|
| `/login` | `LoginComponent` |
| `/dashboard` | `DashboardComponent` |
| `/campaigns` | `CampaignsComponent` |
| `/posts` | `PostsComponent` |
| `/posts/:id` | `PostDetailsComponent` |
| `/campaign-list` | `CampaignListComponent` |
| `/campaigns/:id` | `CampaignDetailsComponent` |
| `/chat` | `ChatComponent` |

## Build Constraints

- Initial bundle: 500kB warning, 1MB error (WARNING expected with Lucide icons ~164KB extra)
- Component styles: 4kB warning, 8KB error
- Strict TypeScript enabled (`strict: true` in tsconfig.json)

## Testing

Spec files exist alongside components (`.spec.ts`). Run all tests with `npm test`.

**Note**: Test failures exist in codebase (pre-existing) - tests missing providers for HttpClient, ActivatedRoute. Not related to UI updates.

## UI/UX Updates (May 2026)

### Color Palette (Modern Indigo/Slate)
```css
--color-primary: #6366F1       /* Indigo-500 */
--color-primary-hover: #818CF8 /* Indigo-400 */
--color-primary-dark: #4F46E5 /* Indigo-600 */
--color-sidebar: #1E293B       /* Slate-800 */
--color-sidebar-hover: #334155 /* Slate-700 */
--color-background: #F8FAFC  /* Slate-50 */
--color-success: #10B981      /* Emerald-500 */
```

### Components Updated

1. **Header** (`src/app/shared/header/`)
   - Replaced emojis with Lucide SVG icons
   - Changed `<header>` to `<aside>` for desktop sidebar (semantic)
   - Added accessible `aria-label` on all interactive elements
   - Touch targets ≥44px

2. **Footer** (`src/app/shared/footer/`)
   - Full 4-column professional structure: Company, Quick Links, Connect, Legal
   - Social media icons (Facebook, Twitter, Instagram, LinkedIn)
   - Contact info (email, phone)
   - Responsive grid layout

3. **App Layout** (`src/app/app.component.css`)
   - Proper margin-left for desktop sidebar (260px/280px)
   - Responsive padding

### Dependencies Added

```bash
npm install lucide-angular
```

### Usage

Import icons in component:
```typescript
import { LucideAngularModule, LayoutDashboard, Menu, X } from 'lucide-angular';

@Component({
  imports: [RouterModule, CommonModule, LucideAngularModule],
  ...
})
export class HeaderComponent {
  icons = { layoutDashboard: LayoutDashboard, menu: Menu, x: X };
}
```

In template:
```html
<lucide-icon [img]="icons.layoutDashboard" [size]="20"></lucide-icon>
```

## Notes

- Uses Chart.js for dashboard charts
- Angular 19.1.6 with standalone components
- Prefix: `app` (e.g., `<app-header>`)
- lucide-angular imported via `importProvidersFrom(LucideAngularModule)` in app.config