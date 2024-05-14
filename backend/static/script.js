document.addEventListener('DOMContentLoaded', function () {
    let sneakers = []
    function fetchSneakers() {
        fetch('/sneakers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                sneakers = data
                prikaz(sneakers);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }
    fetchSneakers();

    const def = document.getElementById("default");
    def.addEventListener("click", function(){
        prikaz(sneakers);
    })
    const filterButton = document.getElementById("filter-button");
    filterButton.addEventListener("click", function(){
        applyFilters(sneakers);
    })
    const clearFiltersButton = document.getElementById("clear-filters-button");
    clearFiltersButton.addEventListener("click", function() {
        clearFilterCheckboxes("filters", sneakers);
    });
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener("input", function(event){
        const searchTerm = event.target.value.trim().toLowerCase();
        const filteredSneakers = sneakers.filter(sneaker => sneaker.name.toLowerCase().includes(searchTerm));
        prikaz(filteredSneakers);
    })
    const rastucaCena = document.getElementById("cenaRastuce");
    rastucaCena.addEventListener("click", function() {
        const filteredSneakers = applyFilters(sneakers);
        sortPriceLowToHigh(filteredSneakers);
    });

    const opadajucaCena = document.getElementById("cenaOpadajuce");
    opadajucaCena.addEventListener("click", function() {
        const filteredSneakers = applyFilters(sneakers);
        sortPriceHighToLow(filteredSneakers);
    });

    const starije = document.getElementById("modelStariji");
    starije.addEventListener("click", function() {
        const filteredSneakers = applyFilters(sneakers);
        sortOldest(filteredSneakers);
    });

    const novije = document.getElementById("modelNoviji");
    novije.addEventListener("click", function() {
        const filteredSneakers = applyFilters(sneakers);
        sortNewest(filteredSneakers);
    });
});
function prikaz(sneakers){
    const sContainer=document.getElementById("sneaker-container");
    sContainer.innerHTML="";
    sneakers.forEach(sneaker =>{
        const kartica = document.createElement("div");
        kartica.dataset.gender = sneaker.gender === "Male" ? "male" : sneaker.gender === "Female" ? "female" : "kids";
        kartica.dataset.sneakerId = sneaker.id;
        const slika = document.createElement("img");
        slika.setAttribute("src", sneaker.imageURL);
        const naziv = document.createElement("p");
        naziv.innerText = sneaker.name;
        const cena = document.createElement("p");
        cena.innerText = (sneaker.price/1000).toFixed(3);
        kartica.classList.add("kartica");
        kartica.classList.add("col-3");
        slika.classList.add("patika-slika");
        naziv.classList.add("patika-naslov");
        cena.classList.add("patika-cena");
        cena.append(" RSD");
        kartica.appendChild(slika);
        kartica.appendChild(naziv)
        kartica.appendChild(cena);
        sContainer.appendChild(kartica);
    })
}

function applyFilters(filteredSneakers = sneakers){
    const checkedGender = [...document.querySelectorAll('.gender-checkbox')].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const checkedBrands = [...document.querySelectorAll('.brand-checkbox')].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const checkedPrices = [...document.querySelectorAll('.price-checkbox')].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const checkedSizes = [...document.querySelectorAll('.size-checkbox')].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const checkedColors = [...document.querySelectorAll('.color-checkbox')].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const filteredResults = filteredSneakers.filter(sneaker => {
        return (
            (!checkedGender.length || checkedGender.includes(sneaker.gender) || (sneaker.gender === "Unisex" && (checkedGender.includes("Male") || checkedGender.includes("Female")))) && 
            (!checkedBrands.length || checkedBrands.includes(sneaker.brand)) &&
            (!checkedPrices.length || checkedPrices.some(range => {
                const [min, max] = range.split('-').map(parseFloat);
                const shoePrice = parseFloat(sneaker.price);
                return shoePrice >= min && shoePrice <= max;
            })) &&
            (!checkedSizes.length || checkedSizes.some(size => sneaker.sizeAvailable.includes(parseInt(size)))) &&
            (!checkedColors.length || checkedColors.some(color => sneaker.color.includes(color)))
        );
    });
    prikaz(filteredResults);
    if (filteredResults.length === 0) {
        return [];
    }

    return filteredResults;
}

function clearFilterCheckboxes(filterSectionId, sneakers) {
    var filterSection = document.getElementById(filterSectionId);
    if (filterSection) {
        var checkboxes = filterSection.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
    }
    prikaz(sneakers);
}

function sortPriceLowToHigh(filteredSneakers) {
    const sortedSneakers = filteredSneakers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    prikaz(sortedSneakers);
}

function sortPriceHighToLow(filteredSneakers) {
    const sortedSneakers = filteredSneakers.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    prikaz(sortedSneakers);
}

function sortOldest(filteredSneakers) {
    const sortedSneakers = filteredSneakers.sort((a, b) => a.id - b.id);
    prikaz(sortedSneakers);
}

function sortNewest(filteredSneakers) {
    const sortedSneakers = filteredSneakers.sort((a, b) => b.id - a.id);
    prikaz(sortedSneakers);
}
