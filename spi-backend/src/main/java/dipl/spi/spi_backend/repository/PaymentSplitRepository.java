package dipl.spi.spi_backend.repository;

import dipl.spi.spi_backend.model.PaymentSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentSplitRepository extends JpaRepository<PaymentSplit, Long> {

    List<PaymentSplit> findByArticleId(Long articleId);

    Optional<PaymentSplit> findByArticleIdAndAccountNumber(Long articleId, String accountNumber);
}
