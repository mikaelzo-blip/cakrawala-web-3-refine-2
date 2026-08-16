# CBL unbranded industrial gearmotor — procedural render QA
# Technical drivetrain visualization only; not a manufacturer-specific cutaway.

import bpy
import math
from pathlib import Path
from mathutils import Vector

OUT_DIR = Path('/tmp/cbl-gearmotor-renders')
OUT_DIR.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)


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


def bevel(obj, amount=0.06, segments=4):
    mod = obj.modifiers.new('BEVEL', 'BEVEL')
    mod.width = amount
    mod.segments = segments
    mod.limit_method = 'ANGLE'


def cube(name, location, dims, mat, bevel_amount=0.06):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel(obj, bevel_amount, 4)
    assign(obj, mat)
    return obj


def tapered_box(name, location, bottom_dims, top_dims, height, mat, bevel_amount=0.10):
    bx, by = bottom_dims[0] / 2, bottom_dims[1] / 2
    tx, ty = top_dims[0] / 2, top_dims[1] / 2
    h = height / 2
    verts = [
        (-bx, -by, -h), (bx, -by, -h), (bx, by, -h), (-bx, by, -h),
        (-tx, -ty, h), (tx, -ty, h), (tx, ty, h), (-tx, ty, h),
    ]
    faces = [
        (0, 3, 2, 1), (4, 5, 6, 7),
        (0, 1, 5, 4), (1, 2, 6, 5),
        (2, 3, 7, 6), (3, 0, 4, 7),
    ]
    mesh = bpy.data.meshes.new(name + '_MESH')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    bevel(obj, bevel_amount, 5)
    assign(obj, mat)
    return obj


def cylinder(name, location, radius, depth, mat, rotation=(0, 0, 0), vertices=64, bevel_amount=0.03):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
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
    core = cylinder(name + '_CORE', location, radius * 0.78, width, mat, rotation=rotation, vertices=64)
    group.append(core)
    for i in range(teeth):
        a = (i / teeth) * math.tau
        y = location[1] + math.cos(a) * radius * 0.91
        z = location[2] + math.sin(a) * radius * 0.91
        tooth = cube(
            f'{name}_TOOTH_{i:02d}',
            (location[0], y, z),
            (width * 1.04, radius * 0.13, radius * 0.20),
            mat,
            bevel_amount=0.015,
        )
        tooth.rotation_euler.x = a
        group.append(tooth)
    return group


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


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
    'housing': material('Housing graphite', (0.255, 0.275, 0.285), metallic=0.32, roughness=0.42),
    'housing_dark': material('Housing dark', (0.075, 0.088, 0.095), metallic=0.30, roughness=0.46),
    'motor': material('Motor charcoal', (0.145, 0.16, 0.17), metallic=0.34, roughness=0.38),
    'steel': material('Machined steel', (0.50, 0.53, 0.55), metallic=0.88, roughness=0.22),
    'gear': material('Gear steel', (0.29, 0.31, 0.33), metallic=0.84, roughness=0.27),
    'rubber': material('Seal rubber', (0.015, 0.020, 0.024), metallic=0.0, roughness=0.65),
    'accent': material('CBL rust accent', (0.34, 0.075, 0.018), metallic=0.28, roughness=0.36),
    'focus': material('Warm focus metal', (0.31, 0.285, 0.25), metallic=0.45, roughness=0.36),
    'ghost': material('Ghost housing', (0.32, 0.35, 0.36), metallic=0.20, roughness=0.42, alpha=0.14),
}

GROUPS = {key: [] for key in ['motor', 'input', 'reduction', 'bevel', 'bearing', 'seal', 'output', 'housing', 'cover']}

# Generic cast housing with tapered walls instead of a simple box.
GROUPS['housing'].append(
    tapered_box('HOUSING_MAIN', (-0.60, 0.0, -0.02), (3.00, 2.65), (2.45, 2.10), 2.55, MATS['housing'], 0.12)
)
GROUPS['housing'].append(cube('HOUSING_BASE', (-0.60, 0.02, -1.37), (3.35, 2.95, 0.34), MATS['housing_dark'], 0.075))
GROUPS['housing'].append(cube('INSPECTION_HATCH', (-0.73, 0.10, 1.33), (1.28, 1.18, 0.17), MATS['housing'], 0.055))

for y in (-1.27, 1.27):
    for x in (-1.42, 0.22):
        GROUPS['housing'].append(cube('MOUNT_FOOT', (x, y, -1.58), (0.70, 0.42, 0.25), MATS['housing_dark'], 0.045))

# Cast ribs visible on the front/side plane.
for x in (-1.48, -1.08, -0.68, -0.28):
    GROUPS['housing'].append(cube('CAST_RIB_FRONT', (x, -1.25, -0.10), (0.10, 0.10, 1.55), MATS['housing_dark'], 0.018))

# Output interface faces the viewer/front (-Y), matching a right-angle drivetrain.
GROUPS['cover'].append(cylinder('OUTPUT_BOSS', (-0.62, -1.31, -0.38), 0.88, 0.34, MATS['housing_dark'], rotation=(math.pi / 2, 0, 0)))
GROUPS['cover'].append(cylinder('OUTPUT_COVER', (-0.62, -1.51, -0.38), 0.76, 0.14, MATS['housing'], rotation=(math.pi / 2, 0, 0)))

# Motor / adapter along +X. No logo or nameplate.
GROUPS['motor'].append(cylinder('MOTOR_ADAPTER', (1.03, 0, 0.20), 0.88, 0.32, MATS['housing_dark'], rotation=(0, math.pi / 2, 0)))
GROUPS['motor'].append(cylinder('MOTOR_BODY', (2.28, 0, 0.20), 0.84, 2.20, MATS['motor'], rotation=(0, math.pi / 2, 0)))
for i in range(9):
    x = 1.37 + i * 0.21
    GROUPS['motor'].append(cylinder('MOTOR_FIN', (x, 0, 0.20), 0.91, 0.042, MATS['motor'], rotation=(0, math.pi / 2, 0), bevel_amount=0.012))
GROUPS['motor'].append(cylinder('FAN_COVER', (3.45, 0, 0.20), 0.88, 0.34, MATS['housing_dark'], rotation=(0, math.pi / 2, 0)))
GROUPS['motor'].append(cube('TERMINAL_BOX', (2.05, -0.02, 1.18), (0.82, 0.86, 0.52), MATS['housing_dark'], 0.075))
GROUPS['motor'].append(cube('TERMINAL_BOX_LID', (2.05, -0.02, 1.49), (0.88, 0.92, 0.09), MATS['steel'], 0.028))

# Input shaft / pinion, aligned with motor axis X.
GROUPS['input'].append(cylinder('INPUT_SHAFT', (0.62, 0.02, 0.22), 0.14, 1.55, MATS['steel'], rotation=(0, math.pi / 2, 0)))
GROUPS['input'].append(cylinder('INPUT_PINION', (-0.04, 0.02, 0.22), 0.33, 0.25, MATS['gear'], rotation=(0, math.pi / 2, 0)))

# First reduction stage remains on X-axis.
GROUPS['reduction'] += gear('REDUCTION_GEAR', (-0.48, 0.34, -0.22), 0.70, 0.24, 20, MATS['gear'])
GROUPS['reduction'].append(cylinder('INTERMEDIATE_SHAFT', (-0.48, 0.34, -0.22), 0.13, 1.45, MATS['steel'], rotation=(0, math.pi / 2, 0)))

# Schematic right-angle bevel transfer: pinion axis X, wheel/output axis Y.
GROUPS['bevel'].append(cone('BEVEL_PINION', (-0.63, 0.04, -0.36), 0.39, 0.19, 0.34, MATS['gear'], rotation=(0, math.pi / 2, 0)))
GROUPS['bevel'].append(cone('BEVEL_GEAR', (-0.63, -0.23, -0.38), 0.67, 0.31, 0.34, MATS['gear'], rotation=(math.pi / 2, 0, 0)))

# Output train along Y toward the viewer.
GROUPS['output'].append(cylinder('OUTPUT_SHAFT', (-0.63, -1.15, -0.38), 0.20, 2.30, MATS['steel'], rotation=(math.pi / 2, 0, 0)))
GROUPS['bearing'].append(torus('BEARING_INNER', (-0.63, -0.72, -0.38), 0.38, 0.10, MATS['steel'], rotation=(math.pi / 2, 0, 0)))
GROUPS['bearing'].append(torus('BEARING_OUTER', (-0.63, -1.20, -0.38), 0.40, 0.105, MATS['steel'], rotation=(math.pi / 2, 0, 0)))
GROUPS['seal'].append(torus('OIL_SEAL', (-0.63, -1.63, -0.38), 0.34, 0.078, MATS['rubber'], rotation=(math.pi / 2, 0, 0)))

for i in range(8):
    a = (i / 8) * math.tau
    x = -0.62 + math.cos(a) * 0.64
    z = -0.38 + math.sin(a) * 0.64
    GROUPS['cover'].append(cylinder('COVER_BOLT', (x, -1.62, z), 0.047, 0.09, MATS['steel'], rotation=(math.pi / 2, 0, 0), bevel_amount=0.012))

ALL_OBJECTS = [obj for group in GROUPS.values() for obj in group]
BASE = {
    obj.name: (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy(), list(obj.data.materials))
    for obj in ALL_OBJECTS
}


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
    focus_mat = MATS['focus'] if group_name in ('motor', 'housing') else MATS['accent']
    for obj in GROUPS[group_name]:
        assign(obj, focus_mat)


def ghost_housing():
    for obj in GROUPS['housing'] + GROUPS['cover']:
        assign(obj, MATS['ghost'])


def shift(group_name, delta):
    d = Vector(delta)
    for obj in GROUPS[group_name]:
        obj.location += d


def internal_explode(amount=1.0):
    shift('input', (0.28 * amount, 0, 0))
    shift('reduction', (-0.18 * amount, 0.18 * amount, 0.18 * amount))
    shift('bevel', (-0.10 * amount, -0.16 * amount, -0.04 * amount))
    shift('bearing', (0, -0.22 * amount, 0))
    shift('seal', (0, -0.36 * amount, 0))
    shift('output', (0, -0.42 * amount, 0))


def setup_state(index):
    reset()
    if index == 0:
        return
    if index == 1:
        shift('motor', (0.72, 0, 0))
        highlight('motor')
        return

    shift('motor', (0.95, 0, 0))
    shift('cover', (0, -0.78, 0))
    ghost_housing()
    internal_explode(0.78 if index in (2, 8) else 1.0)

    mapping = {2: 'input', 3: 'reduction', 4: 'bevel', 5: 'bearing', 6: 'seal', 7: 'output', 8: 'housing'}
    if index in mapping:
        highlight(mapping[index])

    if index == 8:
        shift('motor', (-0.28, 0, 0))
        for obj in GROUPS['cover']:
            assign(obj, MATS['ghost'])

    if index == 9:
        reset()


scene = bpy.context.scene
try:
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
except Exception:
    scene.render.engine = 'BLENDER_EEVEE'

scene.render.resolution_x = 1000
scene.render.resolution_y = 750
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

bpy.ops.object.camera_add(location=(8.25, -10.6, 5.45))
camera = bpy.context.object
camera.name = 'CAM_PRODUCT'
camera.data.lens = 64
camera.data.sensor_width = 36
scene.camera = camera
look_at(camera, (0.45, -0.10, -0.10))

area_light('KEY_SOFTBOX', (3.2, -5.2, 7.3), 1200, 5.2, (0.4, 0, 0))
area_light('FILL_SOFTBOX', (-4.0, -2.0, 3.6), 560, 4.2, (-0.5, 0, 0))
area_light('RIM_STRIP', (2.5, 4.6, 4.8), 880, 3.2, (0.3, 0, 0.2))
area_light('FRONT_LIFT', (0.5, -6.5, 0.6), 320, 3.2, (-0.4, -0.8, -0.2))
scene.world.color = (0.012, 0.014, 0.016)

for index in range(10):
    setup_state(index)
    scene.render.filepath = str(OUT_DIR / f'step-{index:02d}.png')
    bpy.ops.render.render(write_still=True)
    print('Rendered', scene.render.filepath)

print('DONE', OUT_DIR)
