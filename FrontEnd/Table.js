function createTable(data) {
    const table = document.createElement('table');
    
    table.style.borderCollapse = 'collapse';

    const maxGradesLength = Math.max(...DATA_for_table.map(item => item.grades.length));

    function calculateWeightedAverage(grades) {
        if (grades.length === 0) return "Niema Ocen"; // На случай, если нет оценок
        
        const totalWeight = grades.reduce((acc, grade) => {
            const MyWeight = Number(grade.weight);
            if (grade.grade > 0 && MyWeight > 0) {
                return acc + MyWeight 
            };
            return acc;
            }, 0); 

        const weightedSum = grades.reduce((acc, grade) => {
            const MyWeight = Number(grade.weight);
            const MyGrade = Number(grade.grade);
            if (grade.grade > 0 && MyWeight > 0) {
                return acc + MyGrade * MyWeight 
            }
            return acc;
            }, 0);
        console.log(typeof DATA_for_table.map(item => item.grades.grade))    
        console.log(totalWeight)
        console.log(weightedSum)
        return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : "Niema Ocen";
    };

    let quantity = 0;

    let SumGrade = 0;
    // return (weightedSum / totalWeight).toFixed(2); // Взвешенная средняя, округляем до 2 знаков
    const container = document.getElementById('data-table-container');
    container.innerHTML = '';

    data.forEach((item) => {
        const row = document.createElement('tr');

        const subjectCell = document.createElement('th');

        subjectCell.textContent = item.sub;
        subjectCell.style.border = '1px solid black';
        subjectCell.style.padding = '5px';

        row.appendChild(subjectCell);

        item.grades.forEach((gradeItem) => {
            const gradeCell = document.createElement('td');
            gradeCell.textContent = `${gradeItem.grade} (${gradeItem.weight})`;
            gradeCell.style.border = '1px solid black'
            gradeCell.style.padding = '5px';

            row.appendChild(gradeCell);



        });

        for (let i = item.grades.length; i < maxGradesLength; i++) {
            const emptyCell = document.createElement('td');
            emptyCell.textContent = '';
            emptyCell.style.border = '1px solid black'
            emptyCell.style.padding = '5px';
            row.appendChild(emptyCell);

            table.appendChild(row);
        }


        let weightedAverage = calculateWeightedAverage(item.grades);
        const averageCell = document.createElement('td');
        averageCell.textContent = weightedAverage;
        averageCell.style.border = '1px solid black'
        averageCell.style.padding = '5px';
        row.appendChild(averageCell);

        table.appendChild(row);

        table.appendChild(row);
            
        NumWeightedAverage = parseFloat(weightedAverage);

        if (NumWeightedAverage > 0) {
            SumGrade += NumWeightedAverage;
            quantity += 1;

            console.log(SumGrade);
            console.log(quantity);
        }


        
    });

    AverageGrade = (SumGrade/quantity).toFixed(2);

    console.log(AverageGrade);

    container.appendChild(table);

    const AverageContainer = document.getElementById('average-grade-container')
    let AverageText = AverageContainer.querySelector('p');

    if (!AverageText) {
        // Если параграфа нет, создаем новый
        AverageText = document.createElement('p');
        AverageContainer.appendChild(AverageText);
    }
    
    AverageText.textContent = `Twoja Ocena Średnia: ${AverageGrade}`;
}
