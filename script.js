document.addEventListener('DOMContentLoaded', function() {
    // Función para actualizar la fecha y hora
    function updateDateTime() {
        const now = new Date();
        const datetime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        document.getElementById('datetime').innerText = datetime;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Manejo del formulario de registro de préstamos
    document.getElementById('loanForm')?.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto
        
        const bookTitle = document.getElementById('bookTitle').value;
        const borrowerName = document.getElementById('borrowerName').value;
        const borrowDate = document.getElementById('borrowDate').value;
        const returnDate = document.getElementById('returnDate').value;

        if (bookTitle && borrowerName && borrowDate && returnDate) {
            const loan = {
                bookTitle,
                borrowerName,
                borrowDate,
                returnDate
            };

            // Guardar los datos en localStorage
            let loans = JSON.parse(localStorage.getItem('loans')) || [];
            loans.push(loan);
            localStorage.setItem('loans', JSON.stringify(loans));

            console.log('Título del Libro:', bookTitle);
            console.log('Nombre del Lector:', borrowerName);
            console.log('Fecha de Préstamo:', borrowDate);
            console.log('Fecha de Devolución:', returnDate);
            alert('Préstamo registrado correctamente');
            document.getElementById('loanForm').reset(); // Limpiar el formulario

            // Actualizar historial
            loadLoanHistory();
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });

    // Función para cargar el historial de préstamos
    function loadLoanHistory() {
        const loanHistoryTable = document.getElementById('loanHistory');
        if (loanHistoryTable) {
            const loans = JSON.parse(localStorage.getItem('loans')) || [];
            const tbody = loanHistoryTable.querySelector('tbody');
            tbody.innerHTML = ''; // Limpiar la tabla antes de volver a llenarla
            loans.forEach((loan, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${loan.bookTitle}</td>
                    <td>${loan.borrowerName}</td>
                    <td>${loan.borrowDate}</td>
                    <td>${loan.returnDate}</td>
                    <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
                `;
                tbody.appendChild(row);
            });

            // Agregar eventos de eliminación a los botones
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    let loans = JSON.parse(localStorage.getItem('loans')) || [];
                    loans.splice(index, 1); // Eliminar el registro del arreglo
                    localStorage.setItem('loans', JSON.stringify(loans)); // Guardar el arreglo actualizado en localStorage
                    loadLoanHistory(); // Recargar el historial actualizado
                });
            });
        }
    }

    // Cargar el historial de préstamos al cargar la página
    loadLoanHistory();

    // Manejo de la barra de búsqueda
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const filter = searchBar.value.toLowerCase();
            const books = document.querySelectorAll('.book-item');
            books.forEach(function(book) {
                const text = book.innerText.toLowerCase();
                book.style.display = text.includes(filter) ? "block" : "none";
            });
        });

        searchBar.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
    }
});
