describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Sami',
      username: 'Sammakko',
      password: 'salasana',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Sammakko')    
      cy.get('#password').type('salasana')    
      cy.get('#login-button').click()
      cy.contains('Sami logged in')
    })

    it('Login fails with wrong credentials', function() {
      cy.get('#username').type('Sammikka')
      cy.get('#password').type('anasalas')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        name: 'Sami',
        username: 'Sammakko',
        password: 'salasana',
      }
    })

    it('A blog can be created', function() {
      cy.get('#username').type('Sammakko')    
      cy.get('#password').type('salasana')    
      cy.get('#login-button').click()
      cy.contains('new blog').click()      
      cy.get('#title').type('Samin seikkailut Sansibaarilla')
      cy.get('#author').type('Mikael Sääski')
      cy.get('#url').type('otava.fi')      
      cy.contains('save new blog').click()      
      cy.contains('Samin seikkailut Sansibaarilla Mikael Sääski')   
    })
  })

    describe('View a blog', function() {
      beforeEach(function() {
          cy.get('input:first').type('Sammakko')
          cy.get('input:last').type('salasana')
          cy.contains('login').click()

          cy.contains('logged in')

          cy.contains('new blog').click()
          cy.get('input:first').type('Samin seikkailut Sansibaarilla')
          cy.get('#author').type('Mikael Sääski')
          cy.get('input:last').type('otava.fi')
          cy.contains('save new blog').click()

          cy.contains('Samin seikkailut Sansibaarilla')
      })


  it('A blog can be liked', function() { 
    cy.contains('view').click()
    cy.contains('0')
    cy.contains('like').click()
    cy.contains('1')
  })
  it('A blog can be deleted', function() { 
    cy.contains('view').click()
    cy.contains('delete').click()
    cy.get('body').should('not.contain', 'otava.fi')

  })
  it('Person who created the blog can see the delete button', function() {
    cy.contains('new blog').click()      
    cy.get('#title').type('Samin seikkailut Suomessa')
    cy.get('#author').type('Heikki Kivi')
    cy.get('#url').type('lastenkirjat.fi')   
    cy.contains('save new blog').click()
    cy.contains('view').click()
    cy.contains('delete').click()

  })

  describe('when there are more blogs', function () {
    beforeEach(function () {
      cy.contains('new blog').click()
      cy.get('input:first').type('Mikki Hiiren Seikkailut')
      cy.get('#author').type('Mikki Hiiri')
      cy.get('input:last').type('https://disney.com')
      cy.contains('save new blog').click() 
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1')

    })
    it('Blog with most likes is shown first', function() {
      cy.get('.blog').eq(0).should('contain', 'Samin seikkailut Sansibaarilla')
      cy.get('.blog').eq(1).should('contain', 'Mikki Hiiren Seikkailut')
  })
  })
})
})