const BLESSINGS = [
    "May fortune be with you all year long!",
    "Wishing you a year of endless long-evity!",
    "May this year bring you long-lasting joy!",
    "To a year that enriches your be-long-ings!",
    "Find yourself amidst life-long friends!",
    "May you always feel you be-long!",
];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("blessing").textContent =
        BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)];
});

//------------------------------------------------------------------//
//------------------------------------------------------------------//
//------------------------------------------------------------------//

let canvas;

const THEMES = 3;
let theme;

const BG_COLORS = ["#ec2789", "#00a64f", "#f9ec31"];
let bgColor;

const IMG_DIRECTORY = "./assets/img/";

let module;
let head = [];

//------------------------------------------------------------------//

const FORCE_MAGNITUDE = 0.24;
const MAX_SPEED = 5;

const SET_ATTRACTOR_PHASE = 60;
const ATTRACTOR_COUNT = 1;

const OSCILLATION_PHASE = 90;
const OSCILLATION_AMPLITUDE_RATIO = 0.12;

const SHOW_AGENT_HELPER = false;
const SHOW_AGENT_ORBIT_HELPER = false;
const SHOW_ATTRACTOR_HELPER = false;

//------------------------------------------------------------------//

const DRAGON_MODULE_COUNT = 480;
const DRAGON_TAIL_LENGTH_RATIO = 1;
const DRAGON_MODULE_SIZE_RANGE = [36, 120];

const DRAGON_MODULE_ROTATION_OFFSET = -0.04;
const DRAGON_MODULE_ROTATION_INCREMENT = 0.002;

//------------------------------------------------------------------//

const DRAGON_HEAD_WIDTH = 280;
const DRAGON_HEAD_POS_OFFSET = [-2, -1.2, 0, 0.48, 0.8];

//------------------------------------------------------------------//
//------------------------------------------------------------------//
//------------------------------------------------------------------//

function preload() {
    theme = Math.floor(Math.random() * THEMES);

    bgColor = BG_COLORS[theme];

    module = loadImage(`${IMG_DIRECTORY}module-${theme + 1}.png`);

    for (let i = 0; i < 5; i++) {
        head.push(loadImage(`${IMG_DIRECTORY}head-${theme + 1}/${i}.png`));
    }
}

//------------------------------------------------------------------//

function setup() {
    initCanvas();
    initAgent(createVector(width / 2, height));
    initDragon();

    imageMode(CENTER);
}

//------------------------------------------------------------------//

function initCanvas() {
    canvas = createCanvas(
        document.body.offsetWidth,
        document.body.offsetHeight
    );

    canvas.parent = document.getElementById("canvas-wrapper");
}

//------------------------------------------------------------------//

let agent;

function initAgent(pos) {
    agent = new Agent(pos);
}

//------------------------------------------------------------------//

let dragon;

function initDragon() {
    dragon = new Dragon();
}

//------------------------------------------------------------------//
//------------------------------------------------------------------//
//------------------------------------------------------------------//

function draw() {
    background(bgColor);

    agent.update();
    dragon.update(agent.pos);

    dragon.display();
}

//------------------------------------------------------------------//
//------------------------------------------------------------------//
//------------------------------------------------------------------//

class Agent {
    constructor(pos) {
        this.pos;
        this.posOrbit = pos;
        this.vel = createVector(
            MAX_SPEED * Math.cos(random(Math.PI)),
            -MAX_SPEED
        );
        this.acc = createVector(0, 0);

        this.initAttractors();
    }

    //------------------------------------------------------------------//

    initAttractors() {
        this.attractors = [];

        for (let i = 0; i < ATTRACTOR_COUNT; i++) {
            const attractor = createVector(
                random(0, width),
                random(
                    OSCILLATION_AMPLITUDE_RATIO * height,
                    height - OSCILLATION_AMPLITUDE_RATIO * height
                )
            );

            if (SHOW_ATTRACTOR_HELPER) {
                fill(255);
                noStroke();
                ellipse(attractor.x, attractor.y, 4, 4);
            }

            this.attractors.push(attractor);
        }
    }

    //------------------------------------------------------------------//

    update() {
        for (let i = 0; i < ATTRACTOR_COUNT; i++) {
            this.towards(this.attractors[i].x, this.attractors[i].y);
        }

        this.oscillate();

        if (frameCount % SET_ATTRACTOR_PHASE == 0) this.initAttractors();

        if (SHOW_AGENT_HELPER) {
            fill(255);
            stroke(1);
            ellipse(this.pos.x, this.pos.y, 10, 10);
        }

        if (SHOW_AGENT_ORBIT_HELPER) {
            fill(255);
            stroke(255, 0, 0);
            ellipse(this.posOrbit.x, this.posOrbit.y, 10, 10);
        }
    }

    //------------------------------------------------------------------//

    towards(x, y) {
        const attractor = createVector(x, y);

        const force = attractor.sub(this.posOrbit).setMag(FORCE_MAGNITUDE);

        this.vel.add(force);
        if (this.vel.mag() > MAX_SPEED) this.vel.setMag(MAX_SPEED);

        this.posOrbit.add(this.vel);
    }

    //------------------------------------------------------------------//

    oscillate() {
        const osc = map(
            Math.cos(
                map(
                    frameCount % OSCILLATION_PHASE,

                    0,
                    OSCILLATION_PHASE,

                    0,
                    Math.PI * 2
                )
            ),

            -1,
            1,

            -OSCILLATION_AMPLITUDE_RATIO * height,
            OSCILLATION_AMPLITUDE_RATIO * height
        );

        this.pos = createVector(this.posOrbit.x, this.posOrbit.y + osc);
    }
}

//------------------------------------------------------------------//
//------------------------------------------------------------------//
//------------------------------------------------------------------//

class Dragon {
    constructor() {
        this.coordinates = [];
    }

    //------------------------------------------------------------------//

    update(newPos) {
        this.updateCoordinates(newPos);
    }

    //------------------------------------------------------------------//

    updateCoordinates(newPos) {
        this.coordinates.push(newPos);
        if (this.coordinates.length > DRAGON_MODULE_COUNT)
            this.coordinates.shift();
    }

    //------------------------------------------------------------------//

    display() {
        if (this.coordinates.length > 0) {
            this.displayTail();
            this.displayBody();
            this.displayHead();
        }
    }

    //------------------------------------------------------------------//

    displayTail() {
        push();

        translate(this.coordinates[0].x, this.coordinates[0].y);

        // rotate(
        //     this.coordinates.length * DRAGON_MODULE_ROTATION_OFFSET +
        //         frameCount * DRAGON_MODULE_ROTATION_INCREMENT
        // );

        image(
            head[0],
            0,
            0,
            DRAGON_MODULE_SIZE_RANGE[1],
            DRAGON_MODULE_SIZE_RANGE[1]
        );

        pop();
    }

    //------------------------------------------------------------------//

    displayBody() {
        for (let i = 1; i < this.coordinates.length; i++)
            if (
                i % 2 ==
                (this.coordinates.length == DRAGON_MODULE_COUNT
                    ? frameCount % 2
                    : 0)
            ) {
                push();

                translate(this.coordinates[i].x, this.coordinates[i].y);

                rotate(
                    (this.coordinates.length - i - 1) *
                        DRAGON_MODULE_ROTATION_OFFSET +
                        frameCount * DRAGON_MODULE_ROTATION_INCREMENT
                );

                if (
                    i <=
                    this.coordinates.length -
                        DRAGON_MODULE_COUNT * (1 - DRAGON_TAIL_LENGTH_RATIO)
                ) {
                    const diameter = map(
                        i,
                        0,
                        this.coordinates.length -
                            DRAGON_MODULE_COUNT *
                                (1 - DRAGON_TAIL_LENGTH_RATIO),
                        DRAGON_MODULE_SIZE_RANGE[0],
                        DRAGON_MODULE_SIZE_RANGE[1]
                    );

                    image(module, 0, 0, diameter, diameter);
                } else
                    image(
                        module,
                        0,
                        0,
                        DRAGON_MODULE_SIZE_RANGE[1],
                        DRAGON_MODULE_SIZE_RANGE[1]
                    );

                pop();
            }
    }

    //------------------------------------------------------------------//

    displayHead() {
        const direction =
            this.coordinates.length > 1
                ? createVector(
                      this.coordinates[this.coordinates.length - 1].x -
                          this.coordinates[this.coordinates.length - 2].x,
                      this.coordinates[this.coordinates.length - 1].y -
                          this.coordinates[this.coordinates.length - 2].y
                  )
                : createVector(0, 0);

        translate(
            this.coordinates[this.coordinates.length - 1].x,
            this.coordinates[this.coordinates.length - 1].y
        );

        for (let i = 0; i < 5; i++) {
            head[i].resize(DRAGON_HEAD_WIDTH, 0);
            image(
                head[i],
                direction.x * DRAGON_HEAD_POS_OFFSET[i],
                direction.y * DRAGON_HEAD_POS_OFFSET[i]
            );
        }
    }
}
