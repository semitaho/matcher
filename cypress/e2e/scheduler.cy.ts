describe('template spec', () => {

  it('in the schedule page', () => {
    cy.visit('/schedule');
    ['Vimpeli', 'Sotkamo', 'Kempele', 'Kouvola', 'Joensuu', 'Manse PP', 'Kitee', 'JymyJussit', 'Hyvinkää', 'PattU, Raahe', 'Imatra', 'Alajärvi', 'Koskenkorva']
    .forEach((team: string) => {
      it(`${team} should play 24 times`, () => {
        cy.get(`.match:contains('${team}')`).its('length').should('eq', 24);

      });
    });  
  });

  



})