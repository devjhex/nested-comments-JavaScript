(function(){
/* get the elements */
const darkModeCheckBox = document.getElementById('checkbox');
const root = document.documentElement;
const label = document.querySelector('label');

const darkMode = () => {
    if (darkModeCheckBox.checked) {
        root.classList.add('dark');
        label.textContent = "Light Mode";

        /* Reset the local storage darkMode toggle */
        localStorage.setItem('darkMode', "on");
    }else{
        root.classList.remove('dark');
        label.textContent = "Dark Mode";
        localStorage.setItem('darkMode', "off");
    }
}
darkModeCheckBox.addEventListener('change', darkMode);
window.addEventListener('load', () => {
    darkModeCheckBox.checked = localStorage.getItem('darkMode') === "on";
    darkMode();
});
}());