# CBL unbranded gearmotor — schematic internal chapter
# Run after k77_scene_setup.py has produced/opened the base external scene.
# Purpose: create a mechanically plausible, generic drivetrain principle.
# IMPORTANT: this is NOT an exact manufacturer teardown.

import bpy
import math
from mathutils import Vector

SCHEMATIC_COLLECTION = "SCHEMATIC_INTERNALS"


def mat_principled(name, base, metallic=0.0, roughness=0.45):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def assign_material(obj, material):
    if obj.type == "MESH":
        obj.data.materials.clear()
        obj.data.materials.append(material)


def remove_collection_objects(name):
    collection = bpy.data.collections.get(name)
    if not collection:
        return
    for obj in list(collection.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(collection)


def get_or_create_collection(name):
    collection = bpy.data.collections.get(name)
    if not collection:
        collection = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(collection)
    return collection


def move_to_collection(obj, collection):
    for source in list(obj.users_collection):
        source.objects.unlink(obj)
    collection.objects.link(obj)


def world_bounds(obj):
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    mins = Vector((
        min(v.x for v in corners),
        min(v.y for v in corners),
        min(v.z for v in corners),
    ))
    maxs = Vector((
        max(v.x for v in corners),
        max(v.y for v in corners),
        max(v.z for v in corners),
    ))
    return mins, maxs


def key_location(obj, frame, location):
    obj.location = location
    obj.keyframe_insert(data_path="location", frame=frame)


def key_visibility(obj, frame, visible):
    obj.hide_render = not visible
    obj.keyframe_insert(data_path="hide_render", frame=frame)


def set_constant_visibility_interpolation(obj):
    if not obj.animation_data or not obj.animation_data.action:
        return
    for curve in obj.animation_data.action.fcurves:
        if curve.data_path == "hide_render":
            for key in curve.keyframe_points:
                key.interpolation = "CONSTANT"


def set_location_interpolation(obj, mode="BEZIER"):
    if not obj.animation_data or not obj.animation_data.action:
        return
    for curve in obj.animation_data.action.fcurves:
        if curve.data_path != "location":
            continue
        for key in curve.keyframe_points:
            key.interpolation = mode
            key.handle_left_type = "AUTO_CLAMPED"
            key.handle_right_type = "AUTO_CLAMPED"


def axis_rotation(axis):
    if axis == "X":
        return (0.0, math.pi / 2.0, 0.0)
    if axis == "Y":
        return (math.pi / 2.0, 0.0, 0.0)
    return (0.0, 0.0, 0.0)


def add_shaft(name, location, radius, length, axis, material, collection):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64,
        radius=radius,
        depth=length,
        location=location,
        rotation=axis_rotation(axis),
    )
    obj = bpy.context.object
    obj.name = name
    assign_material(obj, material)
    move_to_collection(obj, collection)
    return obj


def add_torus(name, location, major_radius, minor_radius, axis, material, collection):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=64,
        minor_segments=16,
        location=location,
        rotation=axis_rotation(axis),
    )
    obj = bpy.context.object
    obj.name = name
    assign_material(obj, material)
    move_to_collection(obj, collection)
    return obj


def create_gear_mesh(name, teeth, root_radius, tip_radius, thickness, axis, location, material, collection, taper=1.0):
    # Generic toothed wheel for technical visualization only.
    # It intentionally does not encode manufacturer tooth counts or gear data.
    samples = teeth * 4
    front_x = thickness * 0.5
    back_x = -thickness * 0.5
    verts = []
    front_ring = []
    back_ring = []

    for i in range(samples):
        angle = (i / samples) * math.tau
        phase = i % 4
        radius = tip_radius if phase in (1, 2) else root_radius
        y = math.cos(angle)
        z = math.sin(angle)

        front_ring.append(len(verts))
        verts.append((front_x, y * radius, z * radius))

        back_ring.append(len(verts))
        verts.append((back_x, y * radius * taper, z * radius * taper))

    faces = []

    for i in range(samples):
        j = (i + 1) % samples
        faces.append((
            front_ring[i],
            front_ring[j],
            back_ring[j],
            back_ring[i],
        ))

    faces.append(tuple(front_ring))
    faces.append(tuple(reversed(back_ring)))

    mesh = bpy.data.meshes.new(f"{name}_MESH")
    mesh.from_pydata(verts, [], faces)
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.location = location

    if axis == "Y":
        obj.rotation_euler = (0.0, 0.0, math.pi / 2.0)
    elif axis == "Z":
        obj.rotation_euler = (0.0, math.pi / 2.0, 0.0)

    assign_material(obj, material)
    return obj


def mark_schematic(obj, group):
    obj["CBL_SCHEMATIC"] = True
    obj["CBL_SCHEMATIC_GROUP"] = group
    obj["CBL_EXACT_MANUFACTURER_GEOMETRY"] = False


scene = bpy.context.scene

required_scene_objects = [
    "gearbox_housing",
    "output_shaft",
    "motor_adapter_flange",
]
missing = [name for name in required_scene_objects if bpy.data.objects.get(name) is None]
if missing:
    raise RuntimeError(
        "Missing base external scene objects: "
        + ", ".join(missing)
        + ". Open/run the base unbranded external scene first."
    )

housing = bpy.data.objects["gearbox_housing"]
output_reference = bpy.data.objects["output_shaft"]
adapter_reference = bpy.data.objects["motor_adapter_flange"]

remove_collection_objects(SCHEMATIC_COLLECTION)
schematic = get_or_create_collection(SCHEMATIC_COLLECTION)

mins, maxs = world_bounds(housing)
center = (mins + maxs) * 0.5
size = maxs - mins

output_world = output_reference.matrix_world.translation.copy()
adapter_world = adapter_reference.matrix_world.translation.copy()

input_axis_y = adapter_world.y
input_axis_z = adapter_world.z
output_axis_x = output_world.x
output_axis_z = output_world.z

shaft_radius = max(size.z * 0.035, 2.0)
input_length = max(size.x * 0.70, 25.0)
intermediate_length = max(size.x * 0.58, 22.0)
output_length = max(size.y * 0.62, 25.0)

input_center = Vector((
    center.x + size.x * 0.10,
    input_axis_y,
    input_axis_z + size.z * 0.12,
))
intermediate_center = Vector((
    center.x - size.x * 0.04,
    input_axis_y,
    center.z - size.z * 0.16,
))
bevel_center = Vector((
    output_axis_x,
    input_axis_y,
    output_axis_z,
))
output_center = Vector((
    output_axis_x,
    center.y,
    output_axis_z,
))

steel = mat_principled("SCHEMATIC_MACHINED_STEEL", (0.34, 0.37, 0.39), 0.86, 0.24)
gear_steel = mat_principled("SCHEMATIC_GEAR_STEEL", (0.27, 0.30, 0.32), 0.80, 0.28)
bearing_steel = mat_principled("SCHEMATIC_BEARING_STEEL", (0.16, 0.18, 0.19), 0.72, 0.24)
seal_rubber = mat_principled("SCHEMATIC_SEAL_RUBBER", (0.025, 0.028, 0.03), 0.05, 0.68)

parts = {}

parts["input_shaft"] = add_shaft(
    "SCH_INPUT_SHAFT",
    input_center,
    shaft_radius,
    input_length,
    "X",
    steel,
    schematic,
)
mark_schematic(parts["input_shaft"], "02_INPUT_SHAFT")

parts["input_gear"] = create_gear_mesh(
    "SCH_INPUT_GEAR",
    teeth=18,
    root_radius=max(size.z * 0.085, 5.0),
    tip_radius=max(size.z * 0.105, 6.0),
    thickness=max(size.x * 0.07, 5.0),
    axis="X",
    location=(
        center.x + size.x * 0.18,
        input_axis_y,
        input_axis_z + size.z * 0.12,
    ),
    material=gear_steel,
    collection=schematic,
)
mark_schematic(parts["input_gear"], "03_REDUCTION_GEARING")

parts["intermediate_shaft"] = add_shaft(
    "SCH_INTERMEDIATE_SHAFT",
    intermediate_center,
    shaft_radius * 1.05,
    intermediate_length,
    "X",
    steel,
    schematic,
)
mark_schematic(parts["intermediate_shaft"], "03_REDUCTION_GEARING")

parts["intermediate_gear_large"] = create_gear_mesh(
    "SCH_INTERMEDIATE_GEAR_LARGE",
    teeth=30,
    root_radius=max(size.z * 0.15, 8.0),
    tip_radius=max(size.z * 0.18, 9.0),
    thickness=max(size.x * 0.08, 6.0),
    axis="X",
    location=(
        center.x + size.x * 0.15,
        input_axis_y,
        center.z - size.z * 0.16,
    ),
    material=gear_steel,
    collection=schematic,
)
mark_schematic(parts["intermediate_gear_large"], "03_REDUCTION_GEARING")

parts["bevel_pinion"] = create_gear_mesh(
    "SCH_BEVEL_PINION",
    teeth=16,
    root_radius=max(size.z * 0.09, 5.0),
    tip_radius=max(size.z * 0.115, 6.0),
    thickness=max(size.x * 0.08, 6.0),
    axis="X",
    location=(
        bevel_center.x + size.x * 0.06,
        bevel_center.y,
        bevel_center.z,
    ),
    material=gear_steel,
    collection=schematic,
    taper=0.68,
)
mark_schematic(parts["bevel_pinion"], "04_BEVEL_GEAR_SET")

parts["bevel_gear"] = create_gear_mesh(
    "SCH_BEVEL_GEAR",
    teeth=28,
    root_radius=max(size.z * 0.14, 8.0),
    tip_radius=max(size.z * 0.17, 9.5),
    thickness=max(size.y * 0.09, 6.0),
    axis="Y",
    location=(
        bevel_center.x,
        bevel_center.y - size.y * 0.03,
        bevel_center.z,
    ),
    material=gear_steel,
    collection=schematic,
    taper=0.72,
)
mark_schematic(parts["bevel_gear"], "04_BEVEL_GEAR_SET")

parts["output_shaft"] = add_shaft(
    "SCH_OUTPUT_SHAFT",
    output_center,
    shaft_radius * 1.25,
    output_length,
    "Y",
    steel,
    schematic,
)
mark_schematic(parts["output_shaft"], "07_OUTPUT_SHAFT")

bearing_major = max(shaft_radius * 2.1, size.z * 0.065)
bearing_minor = max(shaft_radius * 0.42, size.z * 0.012)

parts["bearing_a"] = add_torus(
    "SCH_OUTPUT_BEARING_A",
    (
        output_axis_x,
        center.y - size.y * 0.18,
        output_axis_z,
    ),
    bearing_major,
    bearing_minor,
    "Y",
    bearing_steel,
    schematic,
)
mark_schematic(parts["bearing_a"], "05_BEARING_SET")

parts["bearing_b"] = add_torus(
    "SCH_OUTPUT_BEARING_B",
    (
        output_axis_x,
        center.y + size.y * 0.16,
        output_axis_z,
    ),
    bearing_major,
    bearing_minor,
    "Y",
    bearing_steel,
    schematic,
)
mark_schematic(parts["bearing_b"], "05_BEARING_SET")

parts["oil_seal"] = add_torus(
    "SCH_OUTPUT_OIL_SEAL",
    (
        output_axis_x,
        mins.y + size.y * 0.05,
        output_axis_z,
    ),
    max(shaft_radius * 1.65, size.z * 0.05),
    max(shaft_radius * 0.25, size.z * 0.008),
    "Y",
    seal_rubber,
    schematic,
)
mark_schematic(parts["oil_seal"], "06_OIL_SEAL")

assembled = {key: obj.location.copy() for key, obj in parts.items()}

for obj in parts.values():
    key_visibility(obj, 1, False)
    key_visibility(obj, 85, False)
    key_visibility(obj, 86, True)
    key_visibility(obj, 160, True)
    set_constant_visibility_interpolation(obj)

for key in ("input_shaft", "input_gear", "intermediate_shaft", "intermediate_gear_large"):
    key_location(parts[key], 86, assembled[key])

key_location(
    parts["input_gear"],
    108,
    assembled["input_gear"] + Vector((size.x * 0.055, 0.0, 0.0)),
)
key_location(
    parts["intermediate_gear_large"],
    108,
    assembled["intermediate_gear_large"] + Vector((-size.x * 0.04, 0.0, 0.0)),
)

for key in ("bevel_pinion", "bevel_gear"):
    key_location(parts[key], 110, assembled[key])

key_location(
    parts["bevel_pinion"],
    128,
    assembled["bevel_pinion"] + Vector((size.x * 0.035, 0.0, 0.0)),
)
key_location(
    parts["bevel_gear"],
    128,
    assembled["bevel_gear"] + Vector((0.0, -size.y * 0.045, 0.0)),
)

for key in ("bearing_a", "bearing_b", "oil_seal", "output_shaft"):
    key_location(parts[key], 130, assembled[key])

key_location(
    parts["bearing_a"],
    144,
    assembled["bearing_a"] + Vector((0.0, -size.y * 0.035, 0.0)),
)
key_location(
    parts["bearing_b"],
    144,
    assembled["bearing_b"] + Vector((0.0, size.y * 0.035, 0.0)),
)
key_location(
    parts["oil_seal"],
    144,
    assembled["oil_seal"] + Vector((0.0, -size.y * 0.055, 0.0)),
)

for key, obj in parts.items():
    key_location(obj, 145, obj.location.copy())
    key_location(obj, 160, assembled[key])
    set_location_interpolation(obj, "BEZIER")

scene["CBL_INTERNAL_VISUAL_MODE"] = "SCHEMATIC_DRIVETRAIN_PRINCIPLE"
scene["CBL_INTERNAL_EXACT_MANUFACTURER_GEOMETRY"] = False
scene["CBL_INTERNAL_DO_NOT_DISPLAY_RATIO_OR_PART_NUMBERS"] = True
scene["CBL_PUBLIC_IDENTITY"] = "UNBRANDED"

if bpy.data.filepath:
    current = bpy.path.abspath("//")
    save_path = current + "CBL_unbranded_gearmotor_scene_v2_schematic.blend"
else:
    save_path = str((bpy.path.abspath("//") or "") + "CBL_unbranded_gearmotor_scene_v2_schematic.blend")

bpy.ops.wm.save_as_mainfile(filepath=save_path)

print("DONE:", save_path)
print("Internal visualization mode: SCHEMATIC_DRIVETRAIN_PRINCIPLE")
print("No exact manufacturer tooth counts, ratios, bearing IDs, seal IDs, or spare-part codes are encoded.")