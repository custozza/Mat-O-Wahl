export function buildChevron(weight) {
    switch(weight) {
        case 3: return `<button class="triangle-container btn-primary btn-sm btn" style="transform: rotate(270deg)"> ⟫ </button>`;
        case 2:return `<button class="triangle-container btn-info btn-sm btn" style="transform: rotate(270deg)"> ⟩ </button>`;
        case 1: return `<button class="triangle-container btn-secondary btn-sm btn" style="transform: rotate(270deg)"> | </button>`;
        case 0: return `<button class="triangle-container btn-warning btn-sm btn" style=""> ∅ </button>`;
        default: throw Error('unknown weight');
    };
}

export function createFoldableText(querySelector) {
    $(querySelector).click((e) => {
        console.log(e.target);
        $(e.target).toggleClass('clamped');
    });
}