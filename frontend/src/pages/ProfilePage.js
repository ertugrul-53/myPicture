

import React from 'react'

export default  function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("user"));




  return (
    <div style={{ padding: "20px" }}>
      <h2>Profil Sayfasına Hoş Geldiniz</h2>
      <p>Burada kullanıcı bilgileri yer alacak.</p>
    </div>
  )
}
