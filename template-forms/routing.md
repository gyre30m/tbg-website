/firms/[firm-name-slugified]/admin

/firms/[firm-name-slugified]/forms

/firms/[firm-name-slugified]/forms/[form-id]
- shows an individual form in read-only view
- **TODO: add list(s) of submitted forms**
- **TODO: show audit trail for firm and site admins**

/admin/site
- only the site admin has access
- TODO: **should add a method to reassign site admin to another user**
- two tabs:
  - law firms
    - table view of all law firms
    - add new firm
    - delete existing firm
    - view and edit a firm's profile info and admin
    - reassign firm admin
  - all forms
    - can view all submitted forms from all firms