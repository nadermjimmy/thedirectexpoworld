# Hosting 3D Renders in the Web App — Developer Guide
# استضافة العروض ثلاثية الأبعاد في تطبيق الويب — دليل المطور

---

## You Do NOT Need Unity
## لا تحتاج Unity

**English:**
Unity WebGL exports are heavy (10–50MB+), slow to load, difficult to integrate with React, and overkill for displaying 3D models in a web app. Our stack (React Three Fiber + Three.js) already **is** a 3D engine running in the browser — no external engine needed.

**العربية:**
تصدير Unity بصيغة WebGL ثقيل (أكثر من 10–50 ميغابايت)، بطيء التحميل، صعب الدمج مع React، ومبالغ فيه لعرض نماذج ثلاثية الأبعاد في تطبيق ويب. المكدس التقني الحالي (React Three Fiber + Three.js) هو بالفعل **محرك ثلاثي الأبعاد** يعمل في المتصفح — لا حاجة لمحرك خارجي.

---

## Recommended Approach: CAD → glTF/GLB → React Three Fiber
## الطريقة الموصى بها: CAD → glTF/GLB → React Three Fiber

**English:**
**glTF (.gltf/.glb)** is the "JPEG of 3D" — it's the web standard format, compact, and React Three Fiber has first-class support for it. This is the pipeline you should follow for any 3D model.

**العربية:**
صيغة **glTF (.gltf/.glb)** هي "JPEG للعالم ثلاثي الأبعاد" — إنها الصيغة القياسية للويب، مضغوطة الحجم، ومدعومة بشكل كامل في React Three Fiber. هذا هو المسار الذي يجب اتباعه لأي نموذج ثلاثي الأبعاد.

---

## The Conversion Pipeline
## مسار التحويل

```
Your CAD file (.step, .iges, .fbx, .obj, .3ds, etc.)
ملف CAD الخاص بك (.step, .iges, .fbx, .obj, .3ds, إلخ)
                    ↓
        Convert to .glb (binary glTF)
        تحويل إلى .glb (صيغة glTF الثنائية)
                    ↓
        Optimize (compress, reduce polygons)
        تحسين (ضغط، تقليل المضلعات)
                    ↓
        Place in apps/web/public/models/
        وضع الملف في apps/web/public/models/
                    ↓
        Load with <Model /> component in R3F
        تحميل باستخدام مكون <Model /> في R3F
                    ↓
        Renders in the expo scene ✓
        يُعرض في مشهد المعرض ✓
```

---

## Conversion Tools by Source Format
## أدوات التحويل حسب صيغة الملف المصدر

| Source Format | Best Converter | Tool (Free/Paid) |
|---|---|---|
| **.fbx, .obj, .3ds** | Blender → File → Export → glTF 2.0 (.glb) | Blender (free) |
| **.step, .iges** (CAD) | FreeCAD → export .obj → Blender → .glb. Or CAD Exchanger (direct STEP → glTF) | FreeCAD (free) / CAD Exchanger (paid) |
| **.skp** (SketchUp) | SketchUp → export .fbx → Blender → .glb | Blender (free) |
| **.usdz** (Apple) | Blender 4.0+ opens natively → export .glb | Blender (free) |
| **.3dm** (Rhino) | Rhino → export .fbx or .obj → Blender → .glb | Blender (free) |

| صيغة الملف المصدر | أفضل أداة تحويل | الأداة (مجانية/مدفوعة) |
|---|---|---|
| **.fbx, .obj, .3ds** | Blender → ملف → تصدير → glTF 2.0 (.glb) | Blender (مجاني) |
| **.step, .iges** (ملفات CAD) | FreeCAD → تصدير .obj → Blender → .glb أو CAD Exchanger (تحويل مباشر من STEP إلى glTF) | FreeCAD (مجاني) / CAD Exchanger (مدفوع) |
| **.skp** (SketchUp) | SketchUp → تصدير .fbx → Blender → .glb | Blender (مجاني) |
| **.usdz** (Apple) | Blender 4.0+ يفتحها مباشرة → تصدير .glb | Blender (مجاني) |
| **.3dm** (Rhino) | Rhino → تصدير .fbx أو .obj → Blender → .glb | Blender (مجاني) |

---

## Optimization (Critical for Web Performance)
## التحسين (ضروري لأداء الويب)

**English:**
After exporting your .glb file, you **must** optimize it before using it in the web app. Raw CAD exports are often too large (50–200MB) for web delivery. Run this command:

```bash
npx @gltf-transform/cli optimize model.glb model-optimized.glb --compress draco
```

This applies:
- **Draco mesh compression** — reduces geometry data by 60–80%
- **Texture optimization** — compresses images embedded in the model
- **Unused data removal** — strips metadata the browser doesn't need

**Target file sizes:**
- Small objects (products, furniture): **< 2MB**
- Medium scenes (rooms, booths): **< 10MB**
- Large environments: **< 25MB** (consider splitting into parts)

**العربية:**
بعد تصدير ملف .glb، **يجب** تحسينه قبل استخدامه في تطبيق الويب. ملفات CAD الخام غالباً ما تكون كبيرة جداً (50–200 ميغابايت) للاستخدام على الويب. شغّل هذا الأمر:

```bash
npx @gltf-transform/cli optimize model.glb model-optimized.glb --compress draco
```

هذا الأمر يطبّق:
- **ضغط Draco للشبكات** — يقلل بيانات الأشكال الهندسية بنسبة 60–80%
- **تحسين القوام (Textures)** — يضغط الصور المضمنة في النموذج
- **إزالة البيانات غير المستخدمة** — يحذف البيانات الوصفية التي لا يحتاجها المتصفح

**الأحجام المستهدفة:**
- أجسام صغيرة (منتجات، أثاث): **أقل من 2 ميغابايت**
- مشاهد متوسطة (غرف، أجنحة): **أقل من 10 ميغابايت**
- بيئات كبيرة: **أقل من 25 ميغابايت** (يُفضّل تقسيمها إلى أجزاء)

---

## How to Load the Model in the App
## كيفية تحميل النموذج في التطبيق

**English:**
Once you have an optimized `.glb` file:

1. Place it in `apps/web/public/models/your-model.glb`
2. Create a component to load it:

```tsx
import { useGLTF } from "@react-three/drei";

function MyModel() {
  const { scene } = useGLTF("/models/your-model.glb");
  return <primitive object={scene} scale={0.5} />;
}

// Preload the model so it's ready when the component mounts.
useGLTF.preload("/models/your-model.glb");
```

3. Use it inside any booth in the expo scene:

```tsx
<Booth>
  <MyModel />
</Booth>
```

The model will inherit the scene's lighting, shadows, and interactivity automatically.

**العربية:**
بمجرد حصولك على ملف `.glb` محسّن:

1. ضعه في المسار `apps/web/public/models/your-model.glb`
2. أنشئ مكوّن (Component) لتحميله:

```tsx
import { useGLTF } from "@react-three/drei";

function MyModel() {
  const { scene } = useGLTF("/models/your-model.glb");
  return <primitive object={scene} scale={0.5} />;
}

// التحميل المسبق للنموذج ليكون جاهزاً عند تركيب المكوّن
useGLTF.preload("/models/your-model.glb");
```

3. استخدمه داخل أي جناح في مشهد المعرض:

```tsx
<Booth>
  <MyModel />
</Booth>
```

سيرث النموذج إضاءة المشهد والظلال والتفاعلية تلقائياً.

---

## Alternative Approaches (When to Use What)
## الطرق البديلة (متى تستخدم كل طريقة)

| Approach | When to Use | Notes |
|---|---|---|
| **glTF in R3F** ✅ | 95% of cases — products, environments, architectural models | Recommended. Already supported in our stack. |
| **Gaussian Splats** | Photorealistic scans of real-world objects/rooms (captured with phone or LiDAR) | drei has `<Splat>` support. Great for real estate walkthroughs. |
| **Point Clouds** | Large-scale LiDAR or survey data (millions of points) | Three.js `Points` handles this. Good for topographic data. |
| **Unity WebGL** ❌ | Only if you have an existing Unity project with C# logic that cannot be rebuilt | Heavy, slow, hard to integrate. Avoid unless absolutely necessary. |
| **`<model-viewer>`** | Simple spin-and-zoom viewer without the full 3D scene | Google's web component. Good for product pages, not for immersive scenes. |

| الطريقة | متى تُستخدم | ملاحظات |
|---|---|---|
| **glTF في R3F** ✅ | في 95% من الحالات — منتجات، بيئات، نماذج معمارية | الطريقة الموصى بها. مدعومة في مكدسنا التقني. |
| **Gaussian Splats** | مسح واقعي لأجسام/غرف حقيقية (تم التقاطها بالهاتف أو LiDAR) | مكتبة drei تدعم `<Splat>`. ممتاز لجولات العقارات. |
| **سحب النقاط (Point Clouds)** | بيانات LiDAR أو مسح واسع النطاق (ملايين النقاط) | Three.js `Points` يتعامل مع هذا. جيد للبيانات الطبوغرافية. |
| **Unity WebGL** ❌ | فقط إذا كان لديك مشروع Unity قائم بمنطق C# لا يمكن إعادة بنائه | ثقيل، بطيء، صعب الدمج. تجنّبه إلا للضرورة القصوى. |
| **`<model-viewer>`** | عارض بسيط للدوران والتكبير بدون المشهد ثلاثي الأبعاد الكامل | مكوّن ويب من Google. جيد لصفحات المنتجات، ليس للمشاهد الغامرة. |

---

## Quick Reference: Blender Export Settings
## مرجع سريع: إعدادات التصدير من Blender

**English:**
When exporting from Blender to glTF:

1. File → Export → glTF 2.0 (.glb)
2. Settings:
   - Format: **glTF Binary (.glb)** (single file, easier to manage)
   - Include: ✅ Mesh, ✅ Materials, ✅ Textures
   - Transform: **+Y Up** (web standard)
   - Geometry → Compression: ✅ Enable Draco (if available)
   - Animation: include only if needed (adds file size)

**العربية:**
عند التصدير من Blender إلى glTF:

1. ملف → تصدير → glTF 2.0 (.glb)
2. الإعدادات:
   - الصيغة: **glTF Binary (.glb)** (ملف واحد، أسهل في الإدارة)
   - تضمين: ✅ الشبكة، ✅ المواد، ✅ القوام
   - التحويل: **+Y Up** (المعيار في الويب)
   - الهندسة → الضغط: ✅ تفعيل Draco (إذا كان متاحاً)
   - الرسوم المتحركة: تضمين فقط إذا لزم الأمر (يزيد حجم الملف)

---

## Project File Structure for Models
## هيكل ملفات المشروع للنماذج

```
apps/web/
├── public/
│   └── models/           ← Place .glb files here
│       ├── booth-keynote.glb
│       ├── booth-demos.glb
│       └── booth-networking.glb
└── src/
    └── scene/
        ├── Scene.tsx      ← Main 3D scene
        ├── Booth.tsx      ← Booth component (add models here)
        └── models/        ← Model loader components
            ├── KeynoteModel.tsx
            ├── DemosModel.tsx
            └── NetworkingModel.tsx
```

```
apps/web/
├── public/
│   └── models/           ← ضع ملفات .glb هنا
│       ├── booth-keynote.glb
│       ├── booth-demos.glb
│       └── booth-networking.glb
└── src/
    └── scene/
        ├── Scene.tsx      ← المشهد الرئيسي ثلاثي الأبعاد
        ├── Booth.tsx      ← مكوّن الجناح (أضف النماذج هنا)
        └── models/        ← مكوّنات تحميل النماذج
            ├── KeynoteModel.tsx
            ├── DemosModel.tsx
            └── NetworkingModel.tsx
```

---

## Summary
## الملخص

**English:**
1. Export your CAD/3D file to **.glb** format (use Blender as the universal converter)
2. Optimize with `gltf-transform` (Draco compression)
3. Place in `apps/web/public/models/`
4. Load with `useGLTF` from drei — 5 lines of code
5. No Unity needed — React Three Fiber handles everything

**العربية:**
1. صدّر ملف CAD/3D إلى صيغة **.glb** (استخدم Blender كأداة تحويل شاملة)
2. حسّن الملف باستخدام `gltf-transform` (ضغط Draco)
3. ضعه في `apps/web/public/models/`
4. حمّله باستخدام `useGLTF` من مكتبة drei — 5 أسطر كود فقط
5. لا حاجة لـ Unity — React Three Fiber يتعامل مع كل شيء

---

*Document prepared for The Direct Expo World project — June 2, 2026*
*تم إعداد هذه الوثيقة لمشروع The Direct Expo World — 2 يونيو 2026*

*Repo: `nadermjimmy/thedirectexpoworld` | Branch: `claude/wonderful-lovelace-oiYWq` | PR #1*
