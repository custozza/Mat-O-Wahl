export function buildChevron(weight) {
    var chevron = `<div class="triangle-container">`
    chevron += weight > 0 ? `<span class="triangle" style="margin-top: 0;">&#8963;</span>` : "";
    chevron += weight > 1 ? `<span class="triangle" sylte="margin-top: -39px; margin-bottom: -17px;">&#8963;</span>` : "";
    chevron += weight > 2 ? `<span class="triangle">&#8963;</span>` : "";
    chevron += `</div>`;
    return chevron;
}