# CBL unbranded industrial gearmotor — procedural render QA
# This is a technical drivetrain visualization, not a manufacturer-specific cutaway.

import bpy
import math
from pathlib import Path
from mathutils import Vector

OUT_DIR = Path('/tmp/cbl-gearmotor-renders')
OUT_DIR.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for material in list(bpy.data.materials):
        bpy.data.materials.remove(material)


def material(name, color, metallic=0.0, roughness=0.45, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Alpha'].default_value = alpha
    mat.diffuse_color = (*color, alpha)
    if alpha < 1.0:
        if hasattr(mat, 'surface_render_method'):
            try:
                mat.surface_render_method = 'DITHERED'
            except Exception:
                pass
        elif hasattr(mat, 'blend_method'):
            mat.blend_method = 'BLEND'
            mat.show_transparent_back = True
    return mat


def assign(obj, mat):
    if obj.type == 'MESH':
        obj.data.materials.clear()
        obj.data.materials.append(mat)


def smooth(obj):
    if obj.type == 'MESH':
        for poly in obj.data.polygons:
            poly.use_smooth = True


def bevel(obj, amount=0.08, segments=4):
    modifier = obj.modifiers.new('BEVEL', 'BEVEL')
    modifier.width = amount
    modifier.segments = segments
    modifier.limit_method = 'ANGLE'


def cube(name, location, dims, mat, bevel_amount=0.08):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel(obj, bevel_amount, 4)
    assign(obj, mat)
    return obj


def cylinder(name, location, radius, depth, mat, rotation=(0, 0, 0), vertices=64, bevel_amount=0.035):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    bevel(obj, bevel_amount, 3)
    assign(obj, mat)
    smooth(obj)
    return obj


def torus(name, location, major_radius, minor_radius, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(
        major_segments=64,
        minor_segments=20,
        major_radius=major_radius,
        minor_radius=minor_radius,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    assign(obj, mat)
    smooth(obj)
    return obj


def cone(name, location, radius1, radius2, depth, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=64,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    bevel(obj, 0.025, 3)
    assign(obj, mat)
    smooth(obj)
    return obj


def gear(name, location, radius, width, teeth, mat, rotation=(0, math.pi / 2, 0)):
    group = []
    core = cylinder(name + '_CORE', location, radius * 0.82, width, mat, rotation=rotation, vertices=64)
    group.append(core)
    for i in range(teeth):
        a = (i / teeth) * math.tau
        y = location[1] + math.cos(a) * radius * 0.91
        z = location[2] + math.sin(a) * radius * 0.91
        tooth = cube(
            f'{name}_TOOTH_{i:02d}',
            (location[0], y, z),
            (width * 1.05, radius * 0.16, radius * 0.22),
            mat,
            bevel_amount=0.018,
        )
        tooth.rotation_euler.x = a
        group.append(tooth)
    return group


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def area_light(name, location, energy, size, target):
    data = bpy.data.lights.new(name=name, type='AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


clear_scene()

MATS = {
    'housing': material('Housing graphite', (0.29, 0.31, 0.31), metallic=0.35, roughness=0.38),
    'housing_dark': material('Housing dark', (0.10, 0.115, 0.12), metallic=0.32, roughness=0.42),
    'motor': material('Motor charcoal', (0.17, 0.185, 0.19), metallic=0.35, roughness=0.36),
    'steel': material('Machined steel', (0.47, 0.50, 0.52), metallic=0.86, roughness=0.23),
    'gear': material('Gear steel', (0.30, 0.32, 0.34), metallic=0.82, roughness=0.28),
    'rubber': material('Seal rubber', (0.018, 0.022, 0.025), metallic=0.0, roughness=0.62),
    'accent': material('CBL rust accent', (0.64, 0.17, 0.045), metallic=0.22, roughness=0.34),
    'ghost': material('Ghost housing', (0.34, 0.37, 0.38), metallic=0.25, roughness=0.38, alpha=0.20),
}

GROUPS = {key: [] for key in ['motor', 'input', 'reduction', 'bevel', 'bearing', 'seal', 'output', 'housing', 'cover']}

# Gearbox housing — deliberately generic, with cast ribs and mounting feet.
GROUPS['housing'].append(cube('HOUSING_MAIN', (-0.55, 0, 0.05), (2.65, 2.75, 2.45), MATS['housing'], 0.18))
GROUPS['housing'].append(cube('HOUSING_BASE', (-0.55, 0, -1.22), (3.15, 2.95, 0.38), MATS['housing_dark'], 0.09))
GROUPS['housing'].append(cube('HOUSING_TOP', (-0.55, 0, 1.29), (1.95, 2.05, 0.34), MATS['housing'], 0.10))

for y in (-1.34, 1.34):
    for x in (-1.45, 0.35):
        GROUPS['housing'].append(cube('MOUNT_FOOT', (x, y, -1.48), (0.72, 0.42, 0.28), MATS['housing_dark'], 0.06))

for z in (-0.75, -0.28, 0.19, 0.66):
    GROUPS['housing'].append(cube('CAST_RIB', (-1.92, 0, z), (0.13, 2.45, 0.18), MATS['housing_dark'], 0.025))

GROUPS['cover'].append(cylinder('OUTPUT_BOSS', (-0.55, 0, -0.96), 0.88, 0.30, MATS['housing_dark'], rotation=(0, 0, 0)))
GROUPS['cover'].append(cylinder('OUTPUT_COVER', (-0.55, 0, -1.17), 0.75, 0.15, MATS['housing'], rotation=(0, 0, 0)))

# Motor + adapter. No logo, no plate, no manufacturer markings.
GROUPS['motor'].append(cylinder('MOTOR_ADAPTER', (1.03, 0, 0.18), 0.90, 0.30, MATS['housing_dark'], rotation=(0, math.pi / 2, 0)))
GROUPS['motor'].append(cylinder('MOTOR_BODY', (2.35, 0, 0.18), 0.88, 2.35, MATS['motor'], rotation=(0, math.pi / 2, 0)))
for i in range(9):
    x = 1.42 + i * 0.23
    GROUPS['motor'].append(cylinder('MOTOR_FIN', (x, 0, 0.18), 0.95, 0.045, MATS['motor'], rotation=(0, math.pi / 2, 0), bevel_amount=0.015))
GROUPS['motor'].append(cylinder('FAN_COVER', (3.60, 0, 0.18), 0.91, 0.34, MATS['housing_dark'], rotation=(0, math.pi / 2, 0)))
GROUPS['motor'].append(cube('TERMINAL_BOX', (2.12, 0, 1.23), (0.88, 0.92, 0.58), MATS['housing_dark'], 0.10))
GROUPS['motor'].append(cube('TERMINAL_BOX_LID', (2.12, 0, 1.56), (0.94, 0.98, 0.10), MATS['steel'], 0.035))

# Input shaft and first pinion.
GROUPS['input'].append(cylinder('INPUT_SHAFT', (0.88, 0, 0.20), 0.15, 1.45, MATS['steel'], rotation=(0, math.pi / 2, 0)))
GROUPS['input'].append(cylinder('INPUT_PINION', (0.20, 0, 0.20), 0.36, 0.24, MATS['gear'], rotation=(0, math.pi / 2, 0)))

# Reduction stage.
GROUPS['reduction'] += gear('REDUCTION_GEAR', (-0.35, 0.48, -0.30), 0.76, 0.24, 18, MATS['gear'])
GROUPS['reduction'].append(cylinder('INTERMEDIATE_SHAFT', (-0.35, 0.48, -0.30), 0.14, 1.62, MATS['steel'], rotation=(0, math.pi / 2, 0)))

# Bevel / right-angle principle: intentionally schematic.
GROUPS['bevel'].append(cone('BEVEL_PINION', (-0.58, 0.15, -0.25), 0.42, 0.20, 0.36, MATS['gear'], rotation=(0, math.pi / 2, 0)))
GROUPS['bevel'].append(cone('BEVEL_GEAR', (-0.58, -0.20, -0.40), 0.74, 0.34, 0.34, MATS['gear'], rotation=(0, 0, 0)))

# Output train, bearings, seal.
GROUPS['output'].append(cylinder('OUTPUT_SHAFT', (-0.58, -0.20, -1.05), 0.22, 2.25, MATS['steel'], rotation=(0, 0, 0)))
GROUPS['bearing'].append(torus('BEARING_A', (-0.58, -0.20, -0.58), 0.42, 0.11, MATS['steel']))
GROUPS['bearing'].append(torus('BEARING_B', (-0.58, -0.20, 0.05), 0.42, 0.11, MATS['steel']))
GROUPS['seal'].append(torus('OIL_SEAL', (-0.58, -0.20, -1.55), 0.36, 0.085, MATS['rubber']))

# Small fasteners for scale/readability.
for i in range(8):
    a = (i / 8) * math.tau
    x = -0.55 + math.cos(a) * 0.66
    y = math.sin(a) * 0.66
    GROUPS['cover'].append(cylinder('COVER_BOLT', (x, y, -1.30), 0.055, 0.10, MATS['steel']))

ALL_OBJECTS = [obj for group in GROUPS.values() for obj in group]
BASE = {obj.name: (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy(), [m for m in obj.data.materials]) for obj in ALL_OBJECTS}


def reset():
    for obj in ALL_OBJECTS:
        loc, rot, scl, mats = BASE[obj.name]
        obj.location = loc.copy()
        obj.rotation_euler = rot.copy()
        obj.scale = scl.copy()
        obj.hide_render = False
        obj.data.materials.clear()
        for mat in mats:
            obj.data.materials.append(mat)


def highlight(group_name):
    for obj in GROUPS[group_name]:
        assign(obj, MATS['accent'])


def ghost_housing():
    for obj in GROUPS['housing'] + GROUPS['cover']:
        assign(obj, MATS['ghost'])


def shift(group_name, delta):
    d = Vector(delta)
    for obj in GROUPS[group_name]:
        obj.location += d


def internal_explode(scale=1.0):
    shift('input', (0.30 * scale, 0, 0))
    shift('reduction', (-0.22 * scale, 0.28 * scale, 0.18 * scale))
    shift('bevel', (-0.18 * scale, -0.20 * scale, 0.08 * scale))
    shift('bearing', (0, 0, -0.12 * scale))
    shift('seal', (0, 0, -0.28 * scale))
    shift('output', (0, 0, -0.30 * scale))


def setup_state(index):
    reset()
    if index == 0:
        return
    if index == 1:
        shift('motor', (0.75, 0, 0))
        highlight('motor')
        return

    shift('motor', (1.05, 0, 0))
    shift('cover', (0, -1.15, 0))
    ghost_housing()
    internal_explode(0.80 if index in (2, 8) else 1.0)

    mapping = {2: 'input', 3: 'reduction', 4: 'bevel', 5: 'bearing', 6: 'seal', 7: 'output', 8: 'housing'}
    if index in mapping:
        highlight(mapping[index])

    if index == 8:
        # Housing is the subject again: mostly assembled with internals visible through it.
        shift('motor', (-0.40, 0, 0))
        for obj in GROUPS['housing']:
            assign(obj, MATS['accent'])
        for obj in GROUPS['cover']:
            assign(obj, MATS['ghost'])

    if index == 9:
        reset()


# Studio camera and lights.
scene = bpy.context.scene
try:
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
except Exception:
    scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1200
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = True
if hasattr(scene.render, 'film_transparent_glass'):
    scene.render.film_transparent_glass = True

try:
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass

bpy.ops.object.camera_add(location=(8.6, -10.8, 5.8))
camera = bpy.context.object
camera.name = 'CAM_PRODUCT'
camera.data.lens = 66
camera.data.sensor_width = 36
scene.camera = camera
look_at(camera, (0.55, 0.0, -0.05))

area_light('KEY_SOFTBOX', (3.8, -5.8, 7.8), 1200, 5.5, (0.5, 0, 0))
area_light('FILL_SOFTBOX', (-4.5, -1.5, 3.2), 650, 4.0, (-0.5, 0, 0))
area_light('RIM_STRIP', (3.0, 5.0, 5.0), 950, 3.0, (0.7, 0, 0.3))
area_light('LOW_FILL', (0.0, -2.0, -4.0), 260, 3.5, (0.0, 0, -0.5))

scene.world.color = (0.015, 0.017, 0.019)

for index in range(10):
    setup_state(index)
    scene.render.filepath = str(OUT_DIR / f'step-{index:02d}.png')
    bpy.ops.render.render(write_still=True)
    print('Rendered', scene.render.filepath)

print('DONE', OUT_DIR)
