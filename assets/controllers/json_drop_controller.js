import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="json-drop"
export default class extends Controller {
    static targets = ["textarea"];

    connect() {
        this.textarea = this.element;
        this.textarea.addEventListener('dragover', this.onDragOver.bind(this));
        this.textarea.addEventListener('dragleave', this.onDragLeave.bind(this));
        this.textarea.addEventListener('drop', this.onDrop.bind(this));
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.textarea.classList.add('border-primary');
    }

    onDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.textarea.classList.remove('border-primary');
    }

    onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.textarea.classList.remove('border-primary');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                this.textarea.value = event.target.result;
            };
            reader.readAsText(file);
        }
    }
}
