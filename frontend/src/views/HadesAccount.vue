<template>

  <p>Hades Account</p>

  <div class="container">

    <!-- Pills navs -->
    <ul class="nav nav-pills nav-justified col-8 mx-auto mb-3" role="tablist">

      <li class="nav-item" role="presentation">
        <a class="nav-link active" data-bs-toggle="pill" href="#pills-login" role="tab">Login</a>
      </li>

      <li class="nav-item" role="presentation">
        <a class="nav-link" data-bs-toggle="pill" href="#pills-register" role="tab">Register</a>
      </li>

    </ul>
    <!-- Pills navs -->

    <!-- Pills content -->
    <div class="tab-content">

      <div class="tab-pane fade show active" id="pills-login" role="tabpanel">
        <form class="col-6 mx-auto">

          <!-- Username input -->
          <div class="form-outline mb-5">
            <input type="text" class="form-control" placeholder="Username" />
          </div>

          <!-- Password input -->
          <div class="form-outline mb-5">
            <input type="password" class="form-control" placeholder="Password" />
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary btn-block">Sign in</button>

        </form>
      </div>

      <div class="tab-pane fade" id="pills-register" role="tabpanel">
        <form class="col-6 mx-auto">

          <!-- Username input -->
          <div class="form-outline mb-5">
            <input type="text" class="form-control" placeholder="Username" />
          </div>

          <!-- Password input -->
          <div class="form-outline mb-5">
            <input type="password" class="form-control" placeholder="Password" />
          </div>

          <!-- Repeat Password input -->
          <div class="form-outline mb-5">
            <input type="password" class="form-control" placeholder="Repeat Password" />
          </div>

          <!-- Checkbox -->
          <div class="form-check d-flex justify-content-center mb-3">

            <input class="form-check-input me-2" type="checkbox" />

            <!-- TODO the term -->
            <label class="form-check-label">
              I have read and agree to the terms
            </label>

          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary btn-block">Sign in</button>

        </form>
      </div>

    </div>
    <!-- Pills content -->

  </div>

</template>

<script>
export default {
  name: 'HadesAccount',
}
</script>
