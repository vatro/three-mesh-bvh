import  * as THREE from '../node_modules/three/build/three.module.js'

const cube = new THREE.CubeGeometry(1, 1, 1);
const wiremat = new THREE.LineBasicMaterial({ color: 0x00FF88, wireframe: true, wireframeLinewidth: 1, transparent: true, opacity: 0.3 });
const boxGeom = new THREE.Box3Helper().geometry;

console.log();

class MeshBVHVisualizer extends THREE.Object3D {
    constructor(mesh, depth = 10) {
        super();

        this.depth = depth;
        this._mesh = mesh;
        this._boundsTree = null;

        this.update();
    }

    update() {
        if (this._mesh.geometry.boundsTree !== this._boundsTree || this._oldDepth !== this.depth) {
            while (this.children.length) this.remove(this.children.pop());
            
            this._oldDepth = this.depth;
            this._boundsTree = this._mesh.geometry.boundsTree;

            if (this._boundsTree) {
                const recurse = (n, d) => {
                    if (d === this.depth) return;

                    if (d === this.depth - 1 || n.children.length === 0) {
                        let m = new THREE.LineSegments(boxGeom, wiremat);
                        n.boundingBox.getCenter(m.position)
                        m.scale.subVectors(n.boundingBox.max, n.boundingBox.min).multiplyScalar(0.5);
                        this.add(m);
                    }
                    n.children.forEach(n => recurse(n, d + 1))
                }

                recurse(this._boundsTree._root, 0);
            }
        }

        this.position.copy(this._mesh.position);
        this.rotation.copy(this._mesh.rotation);
        this.scale.copy(this._mesh.scale);
    }
}

export default MeshBVHVisualizer;