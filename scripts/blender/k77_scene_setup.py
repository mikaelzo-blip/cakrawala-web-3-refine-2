# K77 DRN90L4 — Blender Scene v1
# Generated for CV Cakrawala Buana Lestari
# Purpose: verified external SEW geometry only.
# Internal gears/bearings/seals are intentionally NOT fabricated here.

import bpy
from pathlib import Path
from mathutils import Vector

ASSET_NAME = "K77_DRN90L4_external_assembly.glb"

def find_asset():
    candidates = [
        Path.cwd() / ASSET_NAME,
        Path.home() / "Downloads" / ASSET_NAME,
        Path.home() / "Desktop" / ASSET_NAME,
        Path.home() / "Documents" / ASSET_NAME,
    ]
    if bpy.data.filepath:
        candidates.insert(0, Path(bpy.data.filepath).parent / ASSET_NAME)
    for p in candidates:
        if p.exists():
            return p
    raise FileNotFoundError(
        f"Cannot find {ASSET_NAME}. Put the GLB in Downloads, Desktop, Documents, "
        "the current working directory, or next to the .blend file."
    )

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def mat_principled(name, base, metallic=0.0, roughness=0.45):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return m

def assign_material(obj, mat):
    if obj and obj.type == 'MESH':
        obj.data.materials.clear()
        obj.data.materials.append(mat)

def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

def key_location(obj, frame, location):
    obj.location = location
    obj.keyframe_insert(data_path="location", frame=frame)

def set_interpolation(obj, mode='BEZIER'):
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = mode

def create_empty(name, location=(0,0,0), display='PLAIN_AXES', size=35):
    e = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(e)
    e.location = location
    e.empty_display_type = display
    e.empty_display_size = size
    return e

clear_scene()
asset = find_asset()
bpy.ops.import_scene.gltf(filepath=str(asset))
objects = {o.name: o for o in bpy.context.scene.objects if o.type == 'MESH'}

required = [
    "gearbox_housing", "gearbox_side_cover", "output_shaft",
    "motor_body", "motor_endshield_or_fan_end",
    "terminal_box_body", "terminal_box_cover", "terminal_box_label",
    "motor_adapter_flange"
]
missing = [n for n in required if n not in objects]
if missing:
    print("WARNING — missing expected objects:", missing)

def new_collection(name):
    c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if c.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(c)
    return c

verified_col = new_collection("VERIFIED_SEW_EXTERNAL")
for obj in list(objects.values()):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    verified_col.objects.link(obj)

sew_red = mat_principled("SEW_RAL3020_APPROX", (0.72, 0.018, 0.014), 0.05, 0.34)
steel = mat_principled("MACHINED_STEEL", (0.34, 0.37, 0.40), 0.82, 0.24)
dark_steel = mat_principled("DARK_FASTENER_STEEL", (0.055, 0.065, 0.075), 0.72, 0.31)
label_mat = mat_principled("LABEL_DARK", (0.04, 0.04, 0.045), 0.15, 0.35)

for name, obj in objects.items():
    if name == "output_shaft":
        assign_material(obj, steel)
    elif name.startswith("fastener") or "fastener" in name:
        assign_material(obj, dark_steel)
    elif name == "terminal_box_label":
        assign_material(obj, label_mat)
    else:
        assign_material(obj, sew_red)

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 160
scene.render.fps = 30
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.engine = 'BLENDER_EEVEE_NEXT'
try:
    scene.cycles.device = 'GPU'
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = 'OPTIX'
    prefs.get_devices()
    for d in prefs.devices:
        if d.type in {'OPTIX', 'CUDA'}:
            d.use = True
except Exception as exc:
    print("GPU setup note:", exc)

scene.world.color = (0.008, 0.012, 0.017)

bpy.ops.mesh.primitive_plane_add(size=3000, location=(195, -45, -182))
ground = bpy.context.object
ground.name = "STUDIO_GROUND"
ground_mat = mat_principled("STUDIO_CHARCOAL", (0.012, 0.018, 0.025), 0.0, 0.76)
assign_material(ground, ground_mat)

bpy.ops.object.camera_add(location=(790, -930, 410))
cam = bpy.context.object
cam.name = "CAM_HERO"
scene.camera = cam
cam.data.lens = 62
cam.data.sensor_width = 36
cam.data.dof.use_dof = False

target = create_empty("CAM_TARGET", (190, -42, -30), 'SPHERE', 18)
look_at(cam, target.location)

cam.location = (790, -930, 410)
cam.keyframe_insert(data_path="location", frame=1)
cam.location = (745, -900, 390)
cam.keyframe_insert(data_path="location", frame=40)
cam.location = (650, -760, 325)
cam.keyframe_insert(data_path="location", frame=85)
cam.location = (650, -760, 325)
cam.keyframe_insert(data_path="location", frame=145)
cam.location = (790, -930, 410)
cam.keyframe_insert(data_path="location", frame=160)

constraint = cam.constraints.new(type='TRACK_TO')
constraint.target = target
constraint.track_axis = 'TRACK_NEGATIVE_Z'
constraint.up_axis = 'UP_Y'

def area_light(name, location, energy, size, target_point):
    data = bpy.data.lights.new(name=name, type='AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target_point)
    return obj

area_light("KEY_SOFTBOX", (240, -520, 560), 1500, 430, (190, -35, -30))
area_light("RIM_LIGHT", (590, 320, 270), 1050, 260, (235, -10, -15))
area_light("FILL_SOFT", (-230, -260, 150), 500, 340, (90, -30, -20))

motor_names = [
    "motor_body",
    "motor_endshield_or_fan_end",
    "terminal_box_body",
    "terminal_box_cover",
    "terminal_box_label",
    "terminal_box_fastener_01",
    "terminal_box_fastener_02",
]
motor_group = [objects[n] for n in motor_names if n in objects]
cover_group = [objects[n] for n in ["gearbox_side_cover", "fastener_01", "fastener_02"] if n in objects]
original = {o.name: o.location.copy() for o in objects.values()}

for o in motor_group + cover_group:
    key_location(o, 1, original[o.name])
    key_location(o, 40, original[o.name])

for o in motor_group:
    key_location(o, 41, original[o.name])
    key_location(o, 60, original[o.name] + Vector((155, 0, 0)))

adapter = objects.get("motor_adapter_flange")
if adapter:
    key_location(adapter, 1, original[adapter.name])
    key_location(adapter, 60, original[adapter.name])
    key_location(adapter, 72, original[adapter.name] + Vector((42, 0, 0)))

for o in cover_group:
    key_location(o, 61, original[o.name])
    key_location(o, 82, original[o.name] + Vector((-150, 0, 0)))

internal_anchor = create_empty("INTERNAL_VERIFIED_ASSET_ANCHOR", (20, -5, -35), 'CIRCLE', 60)
internal_anchor["status"] = "WAITING_FOR_PRODUCT_SPECIFIC_INTERNAL_REFERENCE"
internal_anchor["do_not_model_from_ai"] = True
create_empty("CALLOUT_OUTPUT_SHAFT", (0, -175, 0), 'SPHERE', 12)
create_empty("CALLOUT_MOTOR_INTERFACE", (220, 0, 0), 'SPHERE', 12)

for o in motor_group:
    key_location(o, 145, original[o.name] + Vector((155, 0, 0)))
for o in cover_group:
    key_location(o, 145, original[o.name] + Vector((-150, 0, 0)))
if adapter:
    key_location(adapter, 145, original[adapter.name] + Vector((42, 0, 0)))

for o in motor_group:
    key_location(o, 160, original[o.name])
for o in cover_group:
    key_location(o, 160, original[o.name])
if adapter:
    key_location(adapter, 160, original[adapter.name])

for o in motor_group + cover_group + ([adapter] if adapter else []) + [cam]:
    set_interpolation(o, 'BEZIER')

for obj in bpy.context.scene.objects:
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.handle_left_type = 'AUTO_CLAMPED'
                kp.handle_right_type = 'AUTO_CLAMPED'

scene["CBL_SCENE_STATUS"] = "EXTERNAL_GEOMETRY_VERIFIED_INTERNAL_PENDING"
scene["CBL_MODEL"] = "SEW K77 DRN90L4"
scene["CBL_MOUNTING_POSITION"] = "M1"
scene["CBL_SHAFT_SIDE"] = "A"
scene["CBL_DO_NOT_FAKE_INTERNALS"] = True
scene["CBL_VERIFIED_FRAME_BOUNDARY"] = 85

save_path = asset.with_name("K77_DRN90L4_scene_v1.blend")
bpy.ops.wm.save_as_mainfile(filepath=str(save_path))
print("DONE:", save_path)
print("Verified exterior sequence prepared through frame 85.")
print("Frames 86–145 intentionally hold until verified internal geometry/reference is available.")
