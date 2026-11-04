---
theme: default
title: "Marketplace et Broken Access Control"
info: "Pitch : mitiger le BAC avec un trigger et un journal d'audit"
author: ETML
transition: slide-left
mdc: true
---

# Et si l'élève dépassait le maître…

## Marketplace et Broken Access Control

<div class="pt-12">
  <span class="px-2 py-1 rounded bg-blue-500 text-white">
    ICT-183 - Thématique 05
  </span>
</div>

---

# MarketPlace => Broken Access Control !

Un utilisateur parvient à modifier des données auxquelles il ne devrait pas avoir accès.

---

# Comment mitiger le BAC ?

Comme en freeride : on ne peut pas toujours **éviter** la chute, mais on peut **limiter les dégâts**.

<v-clicks>

- Prévention : ne pas se mettre en danger (contrôles d'accès)
- Mitigation : un **airbag** qui se déclenche quand ça arrive
- Ici : un **trigger** qui journalise chaque modification

</v-clicks>

---

# 1. Le TRIGGER

Chaque `UPDATE` d'un contrat laisse une trace dans une table de journal.

```sql {1-2|3|4-5|6-9|all}
CREATE TRIGGER trg_contract_evaluation_log
AFTER UPDATE ON worker_contracts
FOR EACH ROW
BEGIN
  INSERT INTO worker_contract_evaluation_logs
    (contract_id, old_success, new_success,
     old_comment, new_comment, old_date, new_date)
  VALUES
    (NEW.contract_id, OLD.success, NEW.success,
     OLD.success_comment, NEW.success_comment,
     OLD.success_date, NEW.success_date);
END;
```

<!--
Adapté de la migration Laravel du projet pm2etml-apps. Les noms de table ont été simplifiés.
-->

---

# Résultat

Dans la table `worker_contract_evaluation_logs` : l'**ancienne** et la **nouvelle** valeur, avec la date du changement.

<div class="mt-4 p-3 bg-green-700 rounded text-green-200">

Même si le BAC se produit, il est **détectable** et **réversible**.

</div>

---
layout: center
class: text-center
---

# Questions ?
