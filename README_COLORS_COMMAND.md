# Color Suggestions Seeder Command

This Laravel command populates the `colors` table with default color suggestions for production deployment.

## Command Overview

**Command:** `php artisan colors:seed-defaults`
**Purpose:** Seeds the database with predefined color suggestions for both white and black backgrounds

## Usage

### Basic Usage

```bash
php artisan colors:seed-defaults
```

### Force Seeding (skip confirmation)

```bash
php artisan colors:seed-defaults --force
```

## Color Sets Included

### White Background Colors (12 colors)

- `#E53726` - Chillie Red
- `#1274EF` - Crayola Blue
- `#FF1466` - Folly
- `#00B250` - Pigment Green
- `#00A899` - Persian Green
- `#FEC901` - Jonquil
- `#F1621D` - Pantone Orange
- `#8914FF` - Electric Violet
- `#FE7CE5` - Web Violet
- `#780303` - Barn Red
- `#656565` - Dim Gray
- `#F5F5F5` - White Smoke

### Black Background Colors (7 colors)

- `#E53726` - Chillie Red
- `#3E8FF3` - Chefchaouen Blue
- `#0BDA68` - Malachite
- `#0BDCC9` - Turquoise
- `#9E3CFF` - Veronica
- `#A01515` - Penn Red
- `#2E2E2E` - Jet

## Features

✅ **Duplicate Prevention:** Won't create duplicate colors  
✅ **Interactive Confirmation:** Asks before proceeding if colors exist  
✅ **Progress Bar:** Shows seeding progress  
✅ **Detailed Summary:** Reports created/skipped counts  
✅ **Force Option:** Skip confirmations with `--force` flag

## Production Deployment

For production servers, run:

```bash
php artisan colors:seed-defaults --force
```

This ensures the color suggestions are available immediately after deployment.

## Output Example

```
Seeding default color suggestions...
 19/19 [████████████████████████████] 100%

✅ Seeding completed!
📊 Created: 19 new colors
⏭️  Skipped: 0 existing colors
📝 Total colors in database: 19
+------------------+-------+
| Background Type  | Count |
+------------------+-------+
| White Background | 12    |
| Black Background | 7     |
| Total            | 19    |
+------------------+-------+
🎨 Default color suggestions are now available for the color picker!
```

## Integration

These colors will automatically appear in:

- **Admin Color Management** (`/admin/theme-colors`)
- **Color Suggestion Modal** (when using color pickers)
- **Dynamic Color Suggestions** (shared via Inertia middleware)
